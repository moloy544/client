'use client'
import { useRouter } from "next/navigation";

export default function CategoryPage() {
    const router = useRouter();
    router.replace('/');
    return null;
}
