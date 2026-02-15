"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Info,
  Phone,
  Loader2,
  ChevronDown,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/redux/store/hooks/useCart";
import { useOrder } from "@/redux/store/hooks/useOrder";
import StoreContainer from "@/components/Layout/StoreContainer";
import { useCreateBkashPaymentMutation } from "@/redux/store/api/payment/paymentApi";
import { cn } from "@/lib/utils";
import { useApplyDiscountMutation } from "@/redux/store/api/discount/discountApi";
import { kwPushAddPaymentInfo, kwPushAddShippingInfo } from "@/lib/Analytics/kwEcom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { districtAliases, districts } from "./_components/districts";

// --- Types ---
type ShippingMethod = "insideDhaka" | "outsideDhaka";
type PaymentMethod = "bkash" | "cashOnDelivery";
type BillingType = "sameAsShipping" | "differentBillingAddress";
type DiscountLabel =
  | { type: "percentage"; value: number }
  | { type: "fixed"; value: number }
  | null;

type DistrictSource = "auto" | "manual" | null;

// ✅ hoisted (prevents "Cannot access before initialization")
function normalizeLines(p: any) {
  const productDoc = p?.product || p;

  const [sizeValue, sizeUnit] = String(p?.selectedSize || "").split(" ");

  const matchedVariant = productDoc?.variants?.find(
    (v: any) =>
      Number(v.size) === Number(sizeValue) &&
      String(v.unit || "").toLowerCase() === String(sizeUnit || "").toLowerCase()
  );

  const originalUnit = Number(matchedVariant?.price ?? p?.price ?? 0);
  // selectedPrice is your FINAL payable unit price (already includes AUTO discount)
  const finalUnit = Number(p?.selectedPrice ?? originalUnit);

  const qty = Math.max(1, Number(p?.quantity || 1));

  const lineOriginal = Math.max(0, Math.round(originalUnit * qty));
  const lineFinal = Math.max(0, Math.round(finalUnit * qty));

  const save = Math.max(0, lineOriginal - lineFinal);
  const hasDiscount = originalUnit > 0 && finalUnit > 0 && finalUnit < originalUnit;

  return {
    productDoc,
    matchedVariant,
    originalUnit,
    finalUnit,
    qty,
    lineOriginal,
    lineFinal,
    save,
    hasDiscount,
  };
}

// --- helpers (strong + safe) ---
const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[—–-]/g, " ")
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

function detectDistrictEnFromText(text: string) {
  const t = norm(text);
  if (!t) return undefined;

  // 1) alias scan
  for (const d of districts) {
    const aliases = districtAliases[d.en] ?? [d.en, d.bn];

    for (const a of aliases) {
      const aa = norm(a);
      if (!aa) continue;

      // english -> word boundary
      const isEnglish = /^[a-z0-9\s]+$/.test(aa);
      if (isEnglish) {
        const re = new RegExp(`\\b${aa.replace(/\s+/g, "\\s+")}\\b`, "i");
        if (re.test(t)) return d.en;
      } else {
        // bangla -> includes (handles suffix-ish forms often still containing root)
        if (t.includes(aa)) return d.en;
      }
    }
  }

  // 2) fallback: match district list itself
  for (const d of districts) {
    const en = norm(d.en);
    const bn = norm(d.bn);

    if (en) {
      const re = new RegExp(`\\b${en.replace(/\s+/g, "\\s+")}\\b`, "i");
      if (re.test(t)) return d.en;
    }
    if (bn && t.includes(bn)) return d.en;
  }

  return undefined;
}

function getDistrictLabel(en?: string) {
  if (!en) return undefined;
  const d = districts.find((x) => x.en === en);
  return d ? `${d.en} — ${d.bn}` : en;
}

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cartItems,
    checkoutItem,
    checkoutMode,
    calculateSubtotal,
    proceedToCartCheckout,
    clearCart,
    appliedCouponCode,
    setAppliedCouponCode,
    clearAppliedCouponCode,
  } = useCart();

  const { handleCreateOrder, loading: isPlacingOrder } = useOrder();

  const [createBkashPayment, { isLoading: isBkashRedirecting }] =
    useCreateBkashPaymentMutation();

  // --- UI state ---
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // ✅ default inside Dhaka
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("insideDhaka");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cashOnDelivery");

  const [billingType, setBillingType] =
    useState<BillingType>("sameAsShipping");

  // ✅ store district EN only (optional)
  const [selectedDistrictEn, setSelectedDistrictEn] = useState<string | undefined>(undefined);
  const [districtSource, setDistrictSource] = useState<DistrictSource>(null);

  // --- Form state ---
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Promotions ---
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(
    appliedCouponCode ?? null
  );
  // ✅ couponDiscount only (NOT auto)
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [discountInfo, setDiscountInfo] = useState<DiscountLabel>(null);

  const [applyDiscount, { isLoading: isApplyingDiscount }] =
    useApplyDiscountMutation();

  // --- Billing details (simple) ---
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingDistrictEn, setBillingDistrictEn] = useState<string | undefined>(undefined);
  const [billingDistrictQuery, setBillingDistrictQuery] = useState("");
  const [billingContactNumber, setBillingContactNumber] = useState("");

  const [districtQuery, setDistrictQuery] = useState("");

  type SubmitStep =
    | "idle"
    | "validating"
    | "creating_order"
    | "redirecting"
    | "done"
    | "error";

  const [submitStep, setSubmitStep] = useState<SubmitStep>("idle");
  const submitStepRef = useRef<SubmitStep>("idle");
  useEffect(() => {
    submitStepRef.current = submitStep;
  }, [submitStep]);

  const isSubmittingRef = useRef(false);

  const stepText: Record<SubmitStep, string> = {
    idle: "",
    validating: "Validating your information…",
    creating_order: "Placing your order…",
    redirecting: paymentMethod === "bkash" ? "Redirecting to bKash…" : "Finishing…",
    done: "Completed!",
    error: "Something went wrong. Please try again.",
  };

  const isBlockingUI = submitStep !== "idle" && submitStep !== "error";

  // --- Display district EN-BN label ---
  const selectedDistrictLabel = useMemo(
    () => getDistrictLabel(selectedDistrictEn),
    [selectedDistrictEn]
  );

  const billingDistrictLabel = useMemo(
    () => getDistrictLabel(billingDistrictEn) || "",
    [billingDistrictEn]
  );

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  // --- Items to display ---
  const itemsToDisplay = useMemo(() => {
    if (checkoutMode && checkoutItem) {
      return [
        {
          ...checkoutItem,
          cartItemId: checkoutItem.cartItemId ?? checkoutItem.id,
        },
      ];
    }
    return (Array.isArray(cartItems) ? cartItems : []).map((it: any) => ({
      ...it,
      cartItemId: it.cartItemId ?? it.id,
    }));
  }, [checkoutMode, checkoutItem, cartItems]);

  // ✅ Auto-pick district from address keywords:
  // - updates while source is "auto" or null
  // - never overrides manual selection
  useEffect(() => {
    if (districtSource === "manual") return;

    const guess = detectDistrictEnFromText(address);

    if (guess && guess !== selectedDistrictEn) {
      setSelectedDistrictEn(guess);
      setDistrictSource("auto");
      setDistrictQuery(getDistrictLabel(guess) ?? "");
      return;
    }

    // if address changed and we no longer detect anything, clear ONLY if it was auto
    if (!guess && districtSource === "auto") {
      setSelectedDistrictEn(undefined);
      setDistrictSource(null);
      setDistrictQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  // ✅ Shipping logic:
  // - If district selected => auto set shipping (Dhaka => inside, else outside)
  // - If no district selected => user can manually choose, no restriction
  useEffect(() => {
    if (!selectedDistrictEn) return;

    const next: ShippingMethod = selectedDistrictEn === "Dhaka" ? "insideDhaka" : "outsideDhaka";
    if (shippingMethod !== next) setShippingMethod(next);
  }, [selectedDistrictEn, shippingMethod]);

  const formatBDT = (amount: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    })
      .format(Math.max(0, Math.round(Number(amount || 0))))
      .replace("BDT", "৳")
      .trim();

  // ✅ subtotal (already includes AUTO discount if you use selectedPrice)
  const subtotal = useMemo(() => {
    if (checkoutMode && checkoutItem) {
      return Number(checkoutItem.selectedPrice || 0) * Number(checkoutItem.quantity || 1);
    }
    return calculateSubtotal();
  }, [checkoutMode, checkoutItem, calculateSubtotal]);

  // ✅ calculate AUTO discount amount only for DISPLAY + payload (not for totals subtraction)
  const autoDiscount = useMemo(() => {
    return itemsToDisplay.reduce((sum, p) => sum + (normalizeLines(p).save || 0), 0);
  }, [itemsToDisplay]);

  // ✅ couponDiscount affects totals
  const safeCouponDiscount = Math.max(0, Math.round(Number(couponDiscount || 0)));

  // ✅ total discount shown & saved in order
  const displayedDiscount = Math.max(0, Math.round(autoDiscount + safeCouponDiscount));

  const estimatedTaxes = 0;

  // ✅ IMPORTANT:
  // subtotal already includes auto discount, so subtract ONLY coupon here
  const discountedSubtotal = Math.max(0, Math.round(subtotal - safeCouponDiscount));

  const FREE_SHIPPING_MIN = 1000;
  const isFreeShipping = useMemo(
    () => discountedSubtotal >= FREE_SHIPPING_MIN,
    [discountedSubtotal]
  );

  const baseShippingCost = useMemo(
    () => (shippingMethod === "outsideDhaka" ? 110 : 50),
    [shippingMethod]
  );

  const shippingCost = useMemo(
    () => (isFreeShipping ? 0 : baseShippingCost),
    [isFreeShipping, baseShippingCost]
  );

  const total = Math.max(0, Math.round(discountedSubtotal + estimatedTaxes + shippingCost));

  // ----------------------------
  // Analytics
  // ----------------------------
  const userData = useMemo(() => {
    return {
      em: email || undefined,
      ph: contactNumber || undefined,
      fn: name || undefined,
      ct: selectedDistrictEn || undefined, // ✅ EN only
      country: "bd",
    };
  }, [email, contactNumber, name, selectedDistrictEn]);

  const analyticsItems = useMemo(() => {
    return itemsToDisplay
      .map((product: any) => {
        const p = product?.product || product;

        const productId =
          product?.product?.id ||
          product?.product?._id ||
          product?.productId ||
          product?.product?.productId;

        const productName = p?.name || product?.name || "Product";
        const brand = p?.brand || "KhushbuWaala";
        const category = p?.categoryId || undefined;

        const variant = product?.selectedSize
          ? String(product.selectedSize).trim().toUpperCase()
          : undefined;

        const [sizeValue, sizeUnit] = String(product?.selectedSize || "").split(" ");
        const matchedVariant = product?.product?.variants?.find(
          (v: any) =>
            Number(v.size) === Number(sizeValue) &&
            String(v.unit || "").toLowerCase() === String(sizeUnit || "").toLowerCase()
        );

        const price = Number(product?.selectedPrice ?? matchedVariant?.price ?? product?.price ?? 0);
        const quantity = Math.max(1, Number(product?.quantity || 1));

        if (!productId) return null;

        return {
          item_id: String(productId),
          item_name: String(productName),
          item_brand: String(brand),
          item_category: category ? String(category) : undefined,
          item_variant: variant ? String(variant) : undefined,
          price,
          quantity,
        };
      })
      .filter(Boolean) as any[];
  }, [itemsToDisplay]);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLTextAreaElement | null>(null);

  const shippingDedupeRef = useRef<string>("");
  const paymentDedupeRef = useRef<string>("");

  useEffect(() => {
    if (!analyticsItems.length) return;
    if (analyticsItems.some((i) => !i.price || i.price <= 0)) return;

    const shippingTier =
      isFreeShipping
        ? "Free Shipping"
        : shippingMethod === "insideDhaka"
          ? "Inside Dhaka"
          : "Outside Dhaka";

    const fp = [
      "ship",
      selectedDistrictEn || "unknown",
      shippingMethod,
      String(Math.round(total)),
      analyticsItems
        .map((i) => `${i.item_id}:${i.item_variant || ""}:${i.price}:${i.quantity}`)
        .sort()
        .join("|"),
    ].join("~");

    if (shippingDedupeRef.current === fp) return;
    shippingDedupeRef.current = fp;

    kwPushAddShippingInfo({
      currency: "BDT",
      value: total,
      items: analyticsItems,
      shipping_tier: shippingTier,
      coupon: appliedPromoCode ?? undefined,
      user_data: userData,
    });
  }, [selectedDistrictEn, shippingMethod, total, analyticsItems, isFreeShipping, appliedPromoCode, userData]);

  useEffect(() => {
    if (!analyticsItems.length) return;
    if (analyticsItems.some((i) => !i.price || i.price <= 0)) return;

    const paymentType = paymentMethod === "bkash" ? "bkash" : "cod";

    const fp = [
      "pay",
      paymentType,
      String(Math.round(total)),
      analyticsItems
        .map((i) => `${i.item_id}:${i.item_variant || ""}:${i.price}:${i.quantity}`)
        .sort()
        .join("|"),
    ].join("~");

    if (paymentDedupeRef.current === fp) return;
    paymentDedupeRef.current = fp;

    kwPushAddPaymentInfo({
      currency: "BDT",
      value: total,
      items: analyticsItems,
      payment_type: paymentType,
      coupon: appliedPromoCode ?? undefined,
      user_data: userData,
    });
  }, [paymentMethod, total, analyticsItems, appliedPromoCode, userData]);

  // --- Validation ---
  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Please enter your full name.";
    if (contactNumber.replace(/\D/g, "").length < 10)
      nextErrors.contactNumber = "Please enter a valid phone number (11 digit).";
    if (!address.trim()) nextErrors.address = "Please enter your full address.";
    setErrors(nextErrors);

    const order: Array<keyof typeof nextErrors> = ["name", "contactNumber", "address"];
    const firstKey = order.find((k) => nextErrors[k]);

    if (firstKey === "name") scrollToField(nameRef.current);
    if (firstKey === "contactNumber") scrollToField(phoneRef.current);
    if (firstKey === "address") scrollToField(addressRef.current);

    return Object.keys(nextErrors).length === 0;
  };

  const buildDiscountItems = () => {
    return itemsToDisplay.map((product: any) => {
      const [sizeValue, sizeUnit] = String(product?.selectedSize || "").split(" ");

      const matchedVariant = product?.product?.variants?.find(
        (v: any) =>
          Number(v.size) === Number(sizeValue) &&
          String(v.unit || "").toLowerCase() === String(sizeUnit || "").toLowerCase()
      );

      const price = Number(product?.selectedPrice ?? matchedVariant?.price ?? 0);
      const qty = Number(product?.quantity || 1);

      const productId =
        product?.product?.id ||
        product?.product?._id ||
        product?.productId;

      const variantId =
        product?.variantId ||
        product?.selectedVariantId ||
        matchedVariant?.id ||
        matchedVariant?._id;

      return { productId, variantId, price, qty };
    });
  };

  const pickDiscountAmount = (res: any) => {
    const root = res?.data ?? res;
    const total = Number(root?.discountAmount ?? 0);
    const orderPart = Number(root?.orderDiscountAmount ?? 0);
    if (total > 0 && orderPart > 0) return total;
    if (total > 0) return total;
    return orderPart;
  };

  const pickDiscountInfo = (res: any): DiscountLabel => {
    const root = res?.data ?? res;

    const od = root?.orderDiscount;
    if (od?.type && typeof od?.value === "number") {
      return { type: od.type, value: Number(od.value) };
    }

    const items = root?.items ?? [];

    for (const it of items) {
      const promo = (it?.appliedDiscounts ?? []).find((d: any) => d?.code);
      if (promo?.type && typeof promo?.value === "number") {
        return { type: promo.type, value: Number(promo.value) };
      }
    }

    for (const it of items) {
      const auto = (it?.appliedDiscounts ?? []).find((d: any) => !d?.code);
      if (auto?.type && typeof auto?.value === "number") {
        return { type: auto.type, value: Number(auto.value) };
      }
    }

    return null;
  };

  const discountLabel = useMemo(() => {
    if (!discountInfo) return null;
    if (discountInfo.type === "percentage") return `${Math.round(discountInfo.value)}%`;
    return formatBDT(discountInfo.value);
  }, [discountInfo]);

  // ✅ Promo apply/remove
  const applyPromo = async () => {
    if (appliedPromoCode) {
      setAppliedPromoCode(null);
      setAppliedCouponCode?.("");
      clearAppliedCouponCode?.();
      setCouponDiscount(0);
      setDiscountInfo(null);
      setPromoCode("");
      toast.success("Promo removed");
      return;
    }

    const code = promoCode.trim().toUpperCase();
    if (!code) return toast.error("Enter a promo code");

    try {
      const items = buildDiscountItems();
      if (!items.length) return toast.error("Your cart is empty.");
      if (items.some((it) => !it.price || it.price <= 0)) {
        return toast.error("Some items have invalid price.");
      }

      const res = await applyDiscount({ code, items }).unwrap();
      const discountAmount = pickDiscountAmount(res);
      const info = pickDiscountInfo(res);

      if (discountAmount <= 0) {
        toast.error("This coupon doesn't apply to your cart.");
        return;
      }

      setAppliedPromoCode(code);
      setAppliedCouponCode?.(code);
      setCouponDiscount(discountAmount);
      setDiscountInfo(info);
      toast.success(`Promo applied: -${formatBDT(discountAmount)}`);
    } catch (e: any) {
      const msg = e?.data?.message || e?.error || "Failed to apply coupon. Please try again.";
      toast.error(msg);
    }
  };

  // ✅ revalidate coupon when cart changes
  useEffect(() => {
    const revalidate = async () => {
      if (!appliedPromoCode) return;
      try {
        const items = buildDiscountItems();
        const res = await applyDiscount({ code: appliedPromoCode, items }).unwrap();
        setCouponDiscount(pickDiscountAmount(res));
        setDiscountInfo(pickDiscountInfo(res));
      } catch {
        setAppliedPromoCode(null);
        setCouponDiscount(0);
        setDiscountInfo(null);
      }
    };
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsToDisplay, appliedPromoCode]);

  // --- Submit order ---
  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    if (isPlacingOrder || isBkashRedirecting) return;

    isSubmittingRef.current = true;
    setSubmitStep("validating");

    try {
      if (!validateForm()) {
        setSubmitStep("idle");
        toast.error("Please fix the highlighted fields");
        return;
      }
      if (!agreeToTerms) {
        setSubmitStep("idle");
        toast.error("Please agree to the terms to continue");
        return;
      }

      setSubmitStep("creating_order");

      const cartItemIds = itemsToDisplay
        .map((item: any) => item.cartItemId)
        .filter(Boolean) as string[];

      const payload: any = {
        cartItemIds,
        amount: total,
        isPaid: false,
        method: paymentMethod,
        orderSource: "WEBSITE",
        saleType: "SINGLE",
        shippingCost: Number(shippingCost),
        additionalNotes,
        coupon: appliedPromoCode ?? null,
        discountAmount: Number(displayedDiscount || 0),

        // ✅ no thana; district optional; store EN
        customerInfo: { name, phone: contactNumber, email, address, district: selectedDistrictEn },
        shippingAddress: { name, phone: contactNumber, email, address, district: selectedDistrictEn },
        billingAddress:
          billingType === "sameAsShipping"
            ? { name, phone: contactNumber, email, address, district: selectedDistrictEn }
            : {
              name: billingName || name,
              phone: billingContactNumber || contactNumber,
              address: billingAddress || address,
              district: billingDistrictEn || selectedDistrictEn,
            },
      };

      const res: any = await handleCreateOrder(payload);
      proceedToCartCheckout();

      const orderId = res?.data?.id || res?.id;
      const payToken = res?.data?.payToken || res?.payToken;

      if (!orderId) {
        setSubmitStep("error");
        toast.error("Order created but orderId missing.");
        return;
      }

      setSubmitStep("redirecting");

      // ✅ COD: go thank you immediately (no artificial delay)
      if (paymentMethod === "cashOnDelivery") {
        clearCart();
        setSubmitStep("done");
        router.push(`/thank-you?order=${encodeURIComponent(orderId)}`);
        return;
      }

      // bKash
      if (!payToken) {
        clearCart();
        setSubmitStep("done");
        toast.error("Order created but payToken missing.");
        router.push(`/thank-you?order=${encodeURIComponent(orderId)}`);
        return;
      }

      const bkashRes = await createBkashPayment({ orderId, payToken }).unwrap();

      if (typeof window !== "undefined") {
        localStorage.setItem("lastBkashOrderId", orderId);
        localStorage.setItem("lastBkashPaymentID", bkashRes.paymentID);
      }

      clearCart();
      setSubmitStep("done");
      window.location.href = bkashRes.bkashURL;
    } catch (err: any) {
      console.error(err);
      setSubmitStep("error");
      toast.error(err?.data?.message || "Failed to place order. Please try again.");
    } finally {
      // ✅ instant unlock if we didn't redirect
      isSubmittingRef.current = false;
      if (submitStepRef.current !== "redirecting" && submitStepRef.current !== "done") {
        setSubmitStep("idle");
      }
    }
  };

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isBlockingUI) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isBlockingUI]);

  function scrollToField(el: HTMLElement | null) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => (el as any)?.focus?.(), 300);
  }

  // ✅ Mobile speed: auto focus + next behavior
  useEffect(() => {
    nameRef.current?.focus?.();
  }, []);

  return (
    <StoreContainer>
      {isBlockingUI && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">Processing</p>
                <p className="text-xs text-gray-600">{stepText[submitStep]}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <div className={cn("flex items-center gap-2", submitStep === "validating" && "font-semibold text-gray-900")}>
                <span className="h-2 w-2 rounded-full bg-gray-300" /> Validating details
              </div>
              <div className={cn("flex items-center gap-2", submitStep === "creating_order" && "font-semibold text-gray-900")}>
                <span className="h-2 w-2 rounded-full bg-gray-300" /> Creating order
              </div>
              <div className={cn("flex items-center gap-2", submitStep === "redirecting" && "font-semibold text-gray-900")}>
                <span className="h-2 w-2 rounded-full bg-gray-300" /> Redirecting
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button className="w-full" disabled>
                Please wait…
              </Button>
            </div>

            <p className="mt-3 text-[11px] text-gray-500">
              Don’t close the tab while we place your order.
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 pt-2 sm:pt-6 pb-6">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <div className="rounded-2xl bg-gradient-to-r from-red-50 via-pink-50 to-red-50 border border-red-100 p-5 flex items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Secure checkout • SSL encrypted
                </p>
              </div>

              <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-red-600" /> Fast delivery</div>
                <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-red-600" /> COD available</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-red-600" /> Support: 10am–10pm</div>
              </div>
            </div>
          </div>

          {/* Mobile summary toggle */}
          <div className="lg:hidden mb-6">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full h-auto py-4 px-4 flex items-center justify-between gap-3 rounded-xl bg-white shadow-sm",
                isMobileSummaryOpen && "ring-1 ring-gray-200"
              )}
              onClick={() => setIsMobileSummaryOpen((s) => !s)}
              aria-expanded={isMobileSummaryOpen}
              aria-controls="mobile-order-summary"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-gray-700">Order summary</span>
                <span className="text-xs text-gray-500">{isMobileSummaryOpen ? "Tap to hide" : "Tap to view"}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base font-semibold text-gray-900">{formatBDT(total)}</span>
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isMobileSummaryOpen ? "rotate-180" : ""}`} />
              </div>
            </Button>

            {isMobileSummaryOpen && (
              <div id="mobile-order-summary" className="mt-4 space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {itemsToDisplay.map((product: any, idx: number) => {
                      const { productDoc, qty, finalUnit, lineOriginal, lineFinal, save, hasDiscount } =
                        normalizeLines(product);

                      return (
                        <div key={`${productDoc?.id}-${product.selectedSize}-${idx}`} className="flex items-start gap-3">
                          <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-100">
                            <Image src={productDoc?.primaryImage} alt={productDoc?.name} fill className="object-cover" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{productDoc?.name}</p>
                            <p className="text-xs text-gray-500">Size: {product.selectedSize}</p>

                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatBDT(finalUnit)} <span className="text-xs font-medium text-gray-500">× {qty}</span>
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">{formatBDT(lineFinal)}</div>
                            {hasDiscount && (
                              <>
                                <div className="text-xs text-gray-500 line-through">{formatBDT(lineOriginal)}</div>
                                <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                  Save {formatBDT(save)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatBDT(subtotal)}</span>
                    </div>

                    {autoDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-700">
                        <span>Discount</span>
                        <span>-{formatBDT(autoDiscount)}</span>
                      </div>
                    )}

                    {safeCouponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-700">
                        <span>Coupon discount{appliedPromoCode ? ` (${appliedPromoCode})` : ""}</span>
                        <span>-{formatBDT(safeCouponDiscount)}</span>
                      </div>
                    )}

                    {safeCouponDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Subtotal after coupon</span>
                        <span>{formatBDT(discountedSubtotal)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        Shipping
                        {isFreeShipping && (
                          <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            Free over ৳{FREE_SHIPPING_MIN}
                          </span>
                        )}
                      </span>
                      <span>
                        {isFreeShipping ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">{formatBDT(baseShippingCost)}</span>
                            <span className="text-green-700 font-semibold">{formatBDT(0)}</span>
                          </>
                        ) : (
                          formatBDT(shippingCost)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Estimated Taxes</span>
                      <span>{formatBDT(estimatedTaxes)}</span>
                    </div>

                    <Separator />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>{formatBDT(total)}</span>
                    </div>

                    {/* Coupon input */}
                    <div className="pt-0">
                      <label className="text-xs font-medium text-gray-600">Have a coupon code?</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Gift card or discount code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button variant="outline" onClick={applyPromo} disabled={isApplyingDiscount}>
                          {isApplyingDiscount ? "Applying..." : appliedPromoCode ? "Remove" : "Apply"}
                        </Button>
                      </div>
                      {discountLabel && appliedPromoCode && (
                        <p className="text-xs text-gray-500 mt-1">Applied: {discountLabel}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* MAIN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-4 lg:col-span-2">
              {/* Delivery Address */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md">Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      ref={nameRef}
                      placeholder="e.g. Rahim Uddin"
                      value={name}
                      enterKeyHint="next"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          phoneRef.current?.focus();
                        }
                      }}
                      onChange={(e) => setName(e.target.value)}
                      className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Number</label>
                    <Input
                      ref={phoneRef}
                      placeholder="01XXXXXXXXX"
                      inputMode="numeric"
                      enterKeyHint="next"
                      value={contactNumber}
                      onChange={(e) => {
                        const v = e.target.value;
                        setContactNumber(v);
                        if (v.replace(/\D/g, "").length >= 11) {
                          addressRef.current?.focus();
                        }
                      }}
                      className={errors.contactNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.contactNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.contactNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Address</label>

                    {/* ✅ 2-line input (textarea) */}
                    <textarea
                      ref={addressRef}
                      rows={2}
                      placeholder="House, Road, Area (you can write full address)"
                      className={cn(
                        "w-full resize-y min-h-[56px] p-3 border rounded-md bg-white text-sm outline-none",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        errors.address ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                      )}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                  </div>

                  {/* ✅ District optional (EN stored, EN-BN shown) */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      District <span className="text-xs text-gray-500">(optional)</span>
                    </label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className="w-full justify-between">
                          <span className={cn(!selectedDistrictEn && "text-gray-500")}>
                            {selectedDistrictLabel ?? "Select your district (optional)"}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 opacity-60" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command shouldFilter>
                          <CommandInput
                            placeholder="Search district (English / বাংলা)..."
                            value={districtQuery}
                            onValueChange={(val) => {
                              setDistrictQuery(val);

                              const q = norm(val);
                              const match = districts.find((d) => {
                                const label = `${d.en} — ${d.bn}`;
                                return norm(label) === q || norm(`${d.en} ${d.bn}`) === q;
                              });

                              if (match) {
                                setSelectedDistrictEn(match.en);
                                setDistrictSource("manual");
                              }
                            }}
                          />

                          <CommandList>
                            <CommandEmpty>No district found.</CommandEmpty>

                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  setSelectedDistrictEn(undefined);
                                  setDistrictSource(null);
                                  setDistrictQuery("");
                                }}
                              >
                                <span className="text-sm text-gray-600">Clear</span>
                              </CommandItem>

                              {districts.map((d) => {
                                const label = `${d.en} — ${d.bn}`;

                                return (
                                  <CommandItem
                                    key={d.en}
                                    value={`${label} ${d.en} ${d.bn}`}
                                    onSelect={() => {
                                      setSelectedDistrictEn(d.en);
                                      setDistrictSource("manual");
                                      setDistrictQuery(label);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedDistrictEn === d.en ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {label}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md">Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={shippingMethod}
                    // ✅ if district NOT selected => user can choose freely
                    // ✅ if district selected => auto, so disable manual change
                    disabled={Boolean(selectedDistrictEn)}
                    onValueChange={(v) => {
                      setShippingMethod(v as ShippingMethod);
                    }}
                    className="gap-3"
                  >
                    <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="insideDhaka" />
                      <span className="text-sm">Inside Dhaka - 50 TK</span>
                    </label>
                    <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="outsideDhaka" />
                      <span className="text-sm">Outside Dhaka - 110 TK</span>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Email + Notes */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md">Contact Email (optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email (optional)</label>
                    <Input
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Additional Notes (optional)</p>
                    <textarea
                      placeholder="Any instructions for delivery"
                      rows={3}
                      className="w-full p-3 border rounded-md bg-white text-sm"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address (simple) */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md">Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={billingType}
                    onValueChange={(v) => setBillingType(v as BillingType)}
                    className="gap-3"
                  >
                    <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="sameAsShipping" />
                      <span className="text-sm">Same as shipping</span>
                    </label>
                    <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="differentBillingAddress" />
                      <span className="text-sm">Use a different billing address</span>
                    </label>
                  </RadioGroup>

                  {billingType === "differentBillingAddress" && (
                    <div className="space-y-3 border rounded-md p-4">
                      <p className="text-sm font-medium">Billing Information</p>

                      <Input
                        placeholder="Name (optional)"
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                      />

                      <Input
                        placeholder="Contact number (optional)"
                        value={billingContactNumber}
                        onChange={(e) => setBillingContactNumber(e.target.value)}
                      />

                      <textarea
                        rows={2}
                        placeholder="Billing address (optional)"
                        className="w-full resize-y min-h-[56px] p-3 border rounded-md bg-white text-sm"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                      />

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" className="w-full justify-between">
                            <span className={cn(!billingDistrictEn && "text-gray-500")}>
                              {billingDistrictLabel || "Billing district (optional)"}
                            </span>
                            <ChevronsUpDown className="h-4 w-4 opacity-60" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                          <Command shouldFilter>
                            <CommandInput
                              placeholder="Search district (English / বাংলা)..."
                              value={billingDistrictQuery}
                              onValueChange={(val) => setBillingDistrictQuery(val)}
                            />
                            <CommandList>
                              <CommandEmpty>No district found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
                                    setBillingDistrictEn(undefined);
                                    setBillingDistrictQuery("");
                                  }}
                                >
                                  <span className="text-sm text-gray-600">Clear</span>
                                </CommandItem>

                                {districts.map((d) => {
                                  const label = `${d.en} — ${d.bn}`;
                                  return (
                                    <CommandItem
                                      key={d.en}
                                      value={`${label} ${d.en} ${d.bn}`}
                                      onSelect={() => {
                                        setBillingDistrictEn(d.en);
                                        setBillingDistrictQuery(label);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          billingDistrictEn === d.en ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {label}
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md">Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-gray-500">All transactions are secure and encrypted.</p>

                  <RadioGroup
                    disabled
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    className="gap-3"
                  >
                    <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="cashOnDelivery" />
                      <span className="text-sm">Cash on Delivery (COD)</span>
                    </label>

                    <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="bkash" />
                      <span className="text-sm">Pay with bKash (Online Payment)</span>
                    </label>

                    {paymentMethod === "cashOnDelivery" && (
                      <p className="text-xs text-gray-600 px-1">
                        Shipping charge applied based on location.
                      </p>
                    )}
                  </RadioGroup>

                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(v) => setAgreeToTerms(Boolean(v))}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the Terms & Conditions and Privacy Policy
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="space-y-3">
                <Button
                  className="w-full h-14 text-lg font-bold"
                  onClick={handleSubmit}
                  disabled={submitStep !== "idle" && submitStep !== "error"}
                >
                  {submitStep !== "idle" && submitStep !== "error" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {stepText[submitStep] || "Processing..."}
                    </span>
                  ) : (
                    "Complete Order"
                  )}
                </Button>

                <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                  <div className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-600" /> SSL Secure</div>
                  <div className="flex items-center gap-1"><Truck className="h-3 w-3 text-red-600" /> Fast Delivery</div>
                  <div className="flex items-center gap-1"><Info className="h-3 w-3 text-blue-600" /> Easy Returns</div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary (desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-md">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {itemsToDisplay.map((product: any, idx: number) => {
                        const { productDoc, qty, finalUnit, lineOriginal, lineFinal, save, hasDiscount } =
                          normalizeLines(product);

                        return (
                          <div key={`${productDoc?.id}-${product.selectedSize}-${idx}`} className="flex items-start gap-3">
                            <div className="relative w-16 h-20 rounded-md overflow-hidden bg-gray-100">
                              <Image src={productDoc?.primaryImage} alt={productDoc?.name} fill className="object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{productDoc?.name}</p>
                              <p className="text-xs text-gray-500">Size: {product.selectedSize}</p>

                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">
                                  {formatBDT(finalUnit)} <span className="text-xs font-medium text-gray-500">× {qty}</span>
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">{formatBDT(lineFinal)}</div>
                              {hasDiscount && (
                                <>
                                  <div className="text-xs text-gray-500 line-through">{formatBDT(lineOriginal)}</div>
                                  <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                    Save {formatBDT(save)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatBDT(subtotal)}</span>
                    </div>

                    {autoDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-700">
                        <span>Discount</span>
                        <span>-{formatBDT(autoDiscount)}</span>
                      </div>
                    )}

                    {safeCouponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-700">
                        <span>Coupon discount{appliedPromoCode ? ` (${appliedPromoCode})` : ""}</span>
                        <span>-{formatBDT(safeCouponDiscount)}</span>
                      </div>
                    )}

                    {safeCouponDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Subtotal after coupon</span>
                        <span>{formatBDT(discountedSubtotal)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        Shipping
                        {isFreeShipping && (
                          <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            Free over ৳{FREE_SHIPPING_MIN}
                          </span>
                        )}
                      </span>
                      <span>
                        {isFreeShipping ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">{formatBDT(baseShippingCost)}</span>
                            <span className="text-green-700 font-semibold">{formatBDT(0)}</span>
                          </>
                        ) : (
                          formatBDT(shippingCost)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Estimated Taxes</span>
                      <span>{formatBDT(estimatedTaxes)}</span>
                    </div>

                    <Separator />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>{formatBDT(total)}</span>
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-medium text-gray-600">Have a coupon code?</label>
                      <div className="mt-1 flex gap-2">
                        <Input
                          placeholder="Gift card or discount code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button variant="outline" onClick={applyPromo} disabled={isApplyingDiscount}>
                          {isApplyingDiscount ? "Applying..." : appliedPromoCode ? "Remove" : "Apply"}
                        </Button>
                      </div>
                      {discountLabel && appliedPromoCode && (
                        <p className="text-xs text-gray-500 mt-1">Applied: {discountLabel}</p>
                      )}
                      {displayedDiscount > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Total discount saved in order: {formatBDT(displayedDiscount)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </div>
    </StoreContainer>
  );
}
