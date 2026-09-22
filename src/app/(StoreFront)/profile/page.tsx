"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Package,
    User,
    Lock,
    MapPin,
    Phone,
    Mail,
    Calendar,
    RefreshCw,
    ShieldCheck,
    ShoppingBag,
    UploadCloud,
    X,
    Navigation,
} from "lucide-react";
import { useAuth } from "@/redux/store/hooks/useAuth";
import {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
} from "@/redux/store/api/user/userApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetMyOrdersQuery } from "@/redux/store/api/order/ordersApi";
import StoreContainer from "@/components/Layout/StoreContainer";

type TabType = "orders" | "profile" | "security";

export default function ProfileClient() {
    const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("orders");

    // Fetch Profile data
    const {
        data: profileData,
        isLoading: loadingProfile,
        refetch: refetchProfile,
    } = useGetUserProfileQuery(undefined, {
        skip: !authUser,
    });

    const [updateUserProfile, { isLoading: updatingProfile }] = useUpdateUserProfileMutation();
    const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

    // Fetch Orders
    const {
        data: myOrdersResponse,
        isLoading: loadingOrders,
        refetch: refetchOrders,
    } = useGetMyOrdersQuery(undefined, {
        skip: !authUser,
    });

    const currentUser = (profileData as any)?.data || profileData || authUser;

    // Handle nested backend response: response.data.data
    const orderPayload = (myOrdersResponse as any)?.data;
    const orders: any[] = Array.isArray(orderPayload?.data)
        ? orderPayload.data
        : Array.isArray((myOrdersResponse as any)?.data)
            ? (myOrdersResponse as any).data
            : Array.isArray(myOrdersResponse)
                ? (myOrdersResponse as any)
                : [];

    const totalOrders = orderPayload?.totalOrders ?? (myOrdersResponse as any)?.totalOrders ?? orders.length;
    const totalSpend = orderPayload?.totalAmount ?? (myOrdersResponse as any)?.totalAmount ?? 0;

    // Profile Form state
    const [profileForm, setProfileForm] = useState({
        name: "",
        phone: "",
        address: "",
        imageUrl: "",
    });

    // Image Drag & Drop State
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Password State
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (currentUser) {
            setProfileForm({
                name: currentUser.name || "",
                phone: currentUser.phone || currentUser.contact || "",
                address: currentUser.address || "",
                imageUrl: currentUser.imageUrl || "",
            });
        }
    }, [currentUser]);

    // Handle image file selection & drag/drop
    const handleImageFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file (PNG, JPG, WebP)");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Set max profile photo dimension
                const maxDim = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxDim) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    }
                } else {
                    if (height > maxDim) {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                // Compress to ~50KB - 80KB JPEG base64 string
                const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);

                setProfileForm((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
                toast.success("Image selected and optimized!");
            };
        };

        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageFile(e.dataTransfer.files[0]);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetUserId = currentUser?.id || authUser?.id;

        if (!targetUserId) {
            toast.error("User session missing. Please log in again.");
            return;
        }

        try {
            await updateUserProfile({
                id: targetUserId,
                updates: {
                    name: profileForm.name.trim(),
                    phone: profileForm.phone.trim(),
                    contact: profileForm.phone.trim(), // sent as fallback
                    address: profileForm.address.trim(),
                    imageUrl: profileForm.imageUrl || null,
                } as any,
            }).unwrap();

            toast.success("Profile updated successfully!");
            refetchProfile();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update profile.");
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        try {
            await changePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
            }).unwrap();

            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            toast.success("Password changed successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update password.");
        }
    };

    const getStatusBadge = (status: string) => {
        const s = (status || "").toUpperCase();
        switch (s) {
            case "DELIVERED":
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Delivered</Badge>;
            case "PROCESSING":
            case "CONFIRMED":
                return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
            case "SHIPPED":
                return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Shipped</Badge>;
            case "CANCELED":
                return <Badge className="bg-rose-50 text-rose-700 border-rose-200">Canceled</Badge>;
            default:
                return <Badge className="bg-gray-50 text-gray-700 border-gray-200">{status || "Pending"}</Badge>;
        }
    };

    return (
        <StoreContainer>
            <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* 1. Header Profile Identity Banner */}
                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                            {currentUser?.imageUrl ? (
                                <img
                                    src={currentUser.imageUrl}
                                    alt={currentUser?.name || "Customer"}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-emerald-200 shadow-2xs"
                                />
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-2xl flex items-center justify-center border border-emerald-200 shadow-2xs">
                                    {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                                        {currentUser?.name || "Customer"}
                                    </h1>
                                    <span title="Verified Customer" className="text-emerald-600">
                                        <ShieldCheck className="w-4 h-4" />
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" /> {currentUser?.email || "No email available"}
                                </p>
                                {(currentUser?.phone || currentUser?.contact) && (
                                    <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-gray-400" /> {currentUser.phone || currentUser.contact}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-6 bg-gray-50/80 px-5 py-3 rounded-xl border border-gray-100 w-full sm:w-auto justify-around">
                            <div className="text-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                                <span className="text-base font-bold text-gray-900">{totalOrders}</span>
                            </div>
                            <div className="w-px h-7 bg-gray-200" />
                            <div className="text-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Spent</span>
                                <span className="text-base font-bold text-emerald-700">৳{Number(totalSpend).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Navigation Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100/80 border border-gray-200/60 overflow-x-auto no-scrollbar">
                    {[
                        { id: "orders", label: `My Orders (${totalOrders})`, icon: Package },
                        { id: "profile", label: "Edit Profile", icon: User },
                        { id: "security", label: "Password & Security", icon: Lock },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all",
                                activeTab === tab.id
                                    ? "bg-white text-emerald-700 shadow-xs"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 3. TAB 1: Order History with Direct Track Order link */}
                {activeTab === "orders" && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900">Purchase History</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetchOrders()}
                                className="text-xs h-8 gap-1.5"
                            >
                                <RefreshCw className="w-3 h-3" /> Refresh
                            </Button>
                        </div>

                        {loadingOrders ? (
                            <div className="p-8 text-center text-xs text-gray-400 animate-pulse bg-white rounded-xl border border-gray-100">
                                Loading your orders...
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="p-8 text-center rounded-xl bg-white border border-dashed border-gray-200 space-y-2.5">
                                <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
                                <p className="text-xs sm:text-sm text-gray-500">You have not placed any orders yet.</p>
                                <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs h-8">
                                    <Link href="/shop">Browse Fragrances</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map((order: any) => {
                                    const queryParam = order.invoice || order.id;

                                    return (
                                        <div
                                            key={order.id}
                                            className="p-4 rounded-xl border border-gray-200/80 bg-white hover:border-gray-300 transition-all space-y-3"
                                        >
                                            {/* Header Row */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                                                        #{order.invoice || order.id.slice(-8).toUpperCase()}
                                                    </span>
                                                    {getStatusBadge(order.status)}
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-[10px] font-bold px-1.5 py-0",
                                                            order.isPaid
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                                        )}
                                                    >
                                                        {order.isPaid ? "Paid" : "Cash on Delivery"}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.orderTime || order.createdAt).toLocaleDateString("en-GB", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>

                                                    {/* Track Order Link */}
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 text-xs px-2.5 border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 gap-1"
                                                    >
                                                        <Link href={`/track-order?query=${encodeURIComponent(queryParam)}`}>
                                                            <Navigation className="w-3 h-3" /> Track
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Ordered Items List */}
                                            <div className="divide-y divide-gray-100">
                                                {(order.orderItems || []).map((item: any) => (
                                                    <div key={item.id} className="py-2 flex items-center justify-between gap-3 text-xs sm:text-sm">
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            {item.product?.primaryImage ? (
                                                                <img
                                                                    src={item.product.primaryImage}
                                                                    alt={item.product?.name}
                                                                    className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                                                                    <Package className="w-4 h-4 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div className="truncate">
                                                                <p className="font-semibold text-gray-900 truncate">
                                                                    {item.product?.name || "Attar / Perfume"}
                                                                </p>
                                                                <p className="text-[11px] text-gray-500">
                                                                    Qty: {item.quantity} {item.variant?.size ? `• ${item.variant.size} ${item.variant?.unit || "ML"}` : ""}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="font-bold text-gray-900 shrink-0">
                                                            ৳{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Bottom Summary Bar */}
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                                                <span className="text-gray-500">
                                                    Delivery: <strong className="text-gray-800">৳{order.shippingCost || 0}</strong>
                                                </span>
                                                <div>
                                                    <span className="text-gray-500 mr-1.5">Total:</span>
                                                    <span className="text-sm font-bold text-emerald-700">
                                                        ৳{Number(order.amount || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. TAB 2: Edit Profile with Image Dropzone */}
                {activeTab === "profile" && (
                    <div className="bg-white rounded-xl border border-gray-200/80 p-5 sm:p-6 max-w-2xl">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4">Update Profile Details</h2>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">

                            {/* Image Upload / Dropzone */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-700">Profile Photo</Label>

                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "relative border-2 border-dashed rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-gray-50/50",
                                        isDragging ? "border-emerald-500 bg-emerald-50/40" : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                handleImageFile(e.target.files[0]);
                                            }
                                        }}
                                    />

                                    {profileForm.imageUrl ? (
                                        <div className="relative group">
                                            <img
                                                src={profileForm.imageUrl}
                                                alt="Preview"
                                                className="w-20 h-20 rounded-2xl object-cover border border-emerald-200 shadow-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setProfileForm((prev) => ({ ...prev, imageUrl: "" }));
                                                }}
                                                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs hover:bg-rose-700 transition-colors"
                                                title="Remove image"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <UploadCloud className="w-5 h-5" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs sm:text-sm font-medium text-gray-800">
                                                    Click to browse or drag & drop photo here
                                                </p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WebP up to 5MB</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-xs font-semibold text-gray-700">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    placeholder="Your full name"
                                    className="text-xs sm:text-sm h-9 bg-white"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    placeholder="01XXXXXXXXX"
                                    className="text-xs sm:text-sm h-9 bg-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="address" className="text-xs font-semibold text-gray-700">
                                    Default Delivery Address
                                </Label>
                                <Textarea
                                    id="address"
                                    value={profileForm.address}
                                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                    placeholder="House, Road, Area, District"
                                    className="text-xs sm:text-sm min-h-[70px] bg-white resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={updatingProfile}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm h-9 px-5 rounded-xl font-medium"
                            >
                                {updatingProfile ? "Saving..." : "Save Profile"}
                            </Button>
                        </form>
                    </div>
                )}

                {/* 5. TAB 3: Change Password */}
                {activeTab === "security" && (
                    <div className="bg-white rounded-xl border border-gray-200/80 p-5 sm:p-6 max-w-xl">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4">Change Account Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                            <div className="space-y-1">
                                <Label htmlFor="oldPass" className="text-xs font-semibold text-gray-700">
                                    Current Password
                                </Label>
                                <Input
                                    id="oldPass"
                                    type="password"
                                    value={passwordForm.oldPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                    className="text-xs sm:text-sm h-9 bg-white"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="newPass" className="text-xs font-semibold text-gray-700">
                                    New Password
                                </Label>
                                <Input
                                    id="newPass"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="text-xs sm:text-sm h-9 bg-white"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="confirmPass" className="text-xs font-semibold text-gray-700">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="confirmPass"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="text-xs sm:text-sm h-9 bg-white"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={changingPassword}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm h-9 px-5 rounded-xl font-medium"
                            >
                                {changingPassword ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </StoreContainer>
    );
}