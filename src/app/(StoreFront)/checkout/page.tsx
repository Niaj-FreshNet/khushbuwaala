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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// --- Types ---
type ShippingMethod = "insideDhaka" | "outsideDhaka";
type PaymentMethod = "bkash" | "cashOnDelivery";
type BillingType = "sameAsShipping" | "differentBillingAddress";
type DiscountLabel =
  | { type: "percentage"; value: number }
  | { type: "fixed"; value: number }
  | null;

// --- Districts ---
const districts = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", "Brahmanbaria", "Chandpur",
  "Chattogram", "Chuadanga", "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni",
  "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah",
  "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur",
  "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
  "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona",
  "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi",
  "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj",
  "Sylhet", "Tangail", "Thakurgaon",
];

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
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("insideDhaka");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cashOnDelivery");
  const [billingType, setBillingType] =
    useState<BillingType>("sameAsShipping");
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(
    undefined
  );
  const [customThana, setCustomThana] = useState("");

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

  // --- Billing details ---
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingDistrict, setBillingDistrict] = useState("");
  const [billingThana, setBillingThana] = useState("");
  const [billingContactNumber, setBillingContactNumber] = useState("");

  const [districtSearch, setDistrictSearch] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");

  type SubmitStep =
    | "idle"
    | "validating"
    | "creating_order"
    | "redirecting"
    | "done"
    | "error";

  const [submitStep, setSubmitStep] = useState<SubmitStep>("idle");
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

  const filteredDistricts = useMemo(() => {
    const q = districtSearch.trim().toLowerCase();
    if (!q) return districts;
    return districts.filter((d) => d.toLowerCase().includes(q));
  }, [districtSearch]);

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

  // 🧩 Shipping logic
  useEffect(() => {
    if (!selectedDistrict) return;

    if (selectedDistrict === "Dhaka") {
      if (shippingMethod !== "insideDhaka") {
        setShippingMethod("insideDhaka");
        // toast.info("Dhaka is inside Dhaka — shipping set automatically to Inside Dhaka.");
      }
    } else {
      if (shippingMethod !== "outsideDhaka") {
        setShippingMethod("outsideDhaka");
        // toast.info(`${selectedDistrict} is outside Dhaka — shipping set automatically to Outside Dhaka.`);
      }
    }
  }, [selectedDistrict, shippingMethod]);

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
  const isFreeShipping = useMemo(() => discountedSubtotal >= FREE_SHIPPING_MIN, [discountedSubtotal]);

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
      ct: selectedDistrict || undefined,
      country: "bd",
    };
  }, [email, contactNumber, name, selectedDistrict]);

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
  const addressRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const shippingDedupeRef = useRef<string>("");
  const paymentDedupeRef = useRef<string>("");

  useEffect(() => {
    if (!selectedDistrict) return;
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
      selectedDistrict,
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
  }, [selectedDistrict, shippingMethod, total, analyticsItems, isFreeShipping, appliedPromoCode, userData]);

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
    if (!address.trim()) nextErrors.address = "Please enter your full address.";
    if (contactNumber.replace(/\D/g, "").length < 10)
      nextErrors.contactNumber = "Please enter a valid phone number.";
    // if (!selectedDistrict) nextErrors.district = "Please select your district.";
    setErrors(nextErrors);

    // ✅ scroll to first invalid field
    const order: Array<keyof typeof nextErrors> = ["name", "address", "contactNumber"];
    const firstKey = order.find((k) => nextErrors[k]);

    if (firstKey === "name") scrollToField(nameRef.current);
    if (firstKey === "address") scrollToField(addressRef.current);
    if (firstKey === "contactNumber") scrollToField(phoneRef.current);

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
      setAppliedCouponCode?.(""); // safe
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
    // HARD block: prevents double click even if state is late
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

        customerInfo: { name, phone: contactNumber, email, address, district: selectedDistrict, thana: customThana },
        shippingAddress: { name, phone: contactNumber, email, address, district: selectedDistrict, thana: customThana },
        billingAddress:
          billingType === "sameAsShipping"
            ? { name, phone: contactNumber, email, address, district: selectedDistrict, thana: customThana }
            : { name: billingName, phone: billingContactNumber, address: billingAddress, district: billingDistrict, thana: billingThana },
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
      // if redirect happens, page unloads; otherwise reset safely
      setTimeout(() => {
        isSubmittingRef.current = false;
        if (submitStep !== "redirecting" && submitStep !== "done") {
          setSubmitStep("idle");
        }
      }, 150);
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
    // smooth scroll to element
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // focus after a tick (important for mobile + smooth scroll)
    setTimeout(() => {
      // focus if it is input/textarea/select button etc
      (el as any)?.focus?.();
    }, 800);
  }

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
                            {/* <div className="absolute top-1 right-1 text-xs bg-black text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                              {product.quantity}
                            </div> */}
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

                    {/* ✅ show auto + coupon cleanly */}
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
                      onChange={(e) => setName(e.target.value)}
                      className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Address</label>
                    <Input
                      ref={addressRef}
                      placeholder="House, Road, Area"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={errors.address ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    <p className="text-xs text-gray-500 mt-1">We deliver across Bangladesh</p>
                    {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Number</label>
                    <Input
                      ref={phoneRef}
                      placeholder="01XXXXXXXXX"
                      inputMode="numeric"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className={errors.contactNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.contactNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.contactNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">District</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" className="w-full justify-between">
                            <span className={cn(!selectedDistrict && "text-gray-500")}>
                              {selectedDistrict ?? "Select your district"}
                            </span>
                            <ChevronsUpDown className="h-4 w-4 opacity-60" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                          <Command shouldFilter>
                            <CommandInput
                              placeholder="Search district..."
                              value={districtQuery}
                              onValueChange={(val) => {
                                setDistrictQuery(val);

                                // ✅ auto-select if exact match
                                const match = districts.find(
                                  (d) => d.toLowerCase() === val.trim().toLowerCase()
                                );

                                if (match) setSelectedDistrict(match);
                              }}
                            />

                            <CommandList>
                              <CommandEmpty>No district found.</CommandEmpty>

                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
                                    setSelectedDistrict(undefined);
                                    setDistrictQuery("");
                                  }}
                                >
                                  <span className="text-sm text-gray-600">Clear</span>
                                </CommandItem>

                                {districts.map((d) => (
                                  <CommandItem
                                    key={d}
                                    value={d}
                                    onSelect={() => {
                                      setSelectedDistrict(d);
                                      setDistrictQuery(d); // ✅ show selected in search box too
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedDistrict?.toLowerCase() === d.toLowerCase()
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {d}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>} */}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Thana (optional)</label>
                      <Input
                        placeholder="e.g. Gulshan"
                        value={customThana}
                        onChange={(e) => setCustomThana(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-2 pt-2">
                    <Checkbox id="newsletter" />
                    <label htmlFor="newsletter" className="text-sm text-gray-600">
                      Save this information for next time
                    </label>
                  </div> */}
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
                    onValueChange={(v) => {
                      if (!selectedDistrict) {
                        toast.warning("Please select your district first.");
                        return;
                      }
                      if (selectedDistrict === "Dhaka" && v === "outsideDhaka") {
                        toast.error("Shipping cost is only 50 TK inside Dhaka");
                        return;
                      }
                      if (selectedDistrict !== "Dhaka" && v === "insideDhaka") {
                        toast.error(` Shipping cost is only 110 TK for ${selectedDistrict}.`);
                        return;
                      }
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
                    <Input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Additional Notes (optional)</p>
                    <textarea
                      placeholder="Add any specific instructions or notes for your order"
                      rows={4}
                      className="w-full p-3 border rounded-md bg-white"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
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
                      <span className="text-sm">Same as shipping address</span>
                    </label>
                    <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="differentBillingAddress" />
                      <span className="text-sm">Use a different billing address</span>
                    </label>
                  </RadioGroup>

                  {billingType === "differentBillingAddress" && (
                    <div className="space-y-4 border rounded-md p-4">
                      <p className="text-sm font-medium">Billing Information</p>
                      <Input placeholder="Name" value={billingName} onChange={(e) => setBillingName(e.target.value)} />
                      <Input placeholder="Address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input placeholder="District" value={billingDistrict} onChange={(e) => setBillingDistrict(e.target.value)} />
                        <Input placeholder="Thana" value={billingThana} onChange={(e) => setBillingThana(e.target.value)} />
                      </div>
                      <Input placeholder="Contact Number" value={billingContactNumber} onChange={(e) => setBillingContactNumber(e.target.value)} />
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
                      <RadioGroupItem value="bkash" />
                      <span className="text-sm">Pay with bKash (Online Payment)</span>
                    </label>

                    <label className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="cashOnDelivery" />
                      <span className="text-sm">Cash on Delivery (COD)</span>
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
                              {/* <div className="absolute top-1 right-1 text-xs bg-black text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                {product.quantity}
                              </div> */}
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
                      {/* Optional: show total discount */}
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
