import * as React from "react";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SidebarCollapsibleMenuContent } from "./app/SidebarCollapsibleMenuContent";
import { SidebarUserMenuComponent } from "./app/SidebarUserMenu";
import { cn } from "@/lib/utils";
import { poppins } from "@/public/fonts";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <section className="flex flex-col">
      <Sidebar {...props}>
        <SidebarContent>
          <div
            className={cn(
              "border-b flex justify-center items-center mt-4 text-xl font-semibold pb-[19px] select-none",
              poppins.className
            )}
          >
            <Link href={"/"} className="flex gap-2">
              <Image
                src={"/icons/icon-128x128.png"}
                alt=""
                width={30}
                height={20}
              />{" "}
              AutoBook
            </Link>
          </div>
          <section className="flex flex-col justify-between h-full">
            <SidebarCollapsibleMenuContent />

            <SidebarUserMenuComponent />
          </section>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </section>
  );
}
