"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function DoctorNavbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");        // Change this if your login page is at "/"
  };

  return (
    <div
      className="flex justify-between items-center px-6 py-4 shadow"
      style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
    >
      <div className="flex items-center gap-3">
        {user?.profileImage && (
          <Image
            src={user.profileImage}
            alt="Doctor"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-lg font-semibold">
            Welcome, {user?.name || "Doctor"}
          </h1>
          {user?.specialization && (
            <p className="text-sm text-muted-foreground">
              {user.specialization}
            </p>
          )}
        </div>
      </div>

      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}