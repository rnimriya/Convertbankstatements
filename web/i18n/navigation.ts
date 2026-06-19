/**
 * Locale-aware navigation helpers.
 * Import Link, redirect, usePathname, useRouter from here
 * instead of next/link / next/navigation so that locale
 * prefix is automatically injected.
 */
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
