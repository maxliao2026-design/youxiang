// app/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Layout from "./Layout";
import { motion, AnimatePresence } from "framer-motion";

export default function participation() {
  return (
    <Layout>
      <section className="section-hero bg-[url('/images/bg02.png')] flex justify-center items-center bg-contain bg-center h-[75vh]">
        <div className="title flex flex-col justify-center items-center">
          <Image
            src="/images/img-0a5ca11822.png"
            alt="logo"
            placeholder="empty"
            loading="lazy"
            width={800}
            height={1500}
            className="max-w-[300px]"
          ></Image>
          <div className="info mt-20">
            <Image
              src="/images/logo-475eb5a483.png"
              alt="logo"
              placeholder="empty"
              loading="lazy"
              width={800}
              height={1500}
              className="max-w-[300px]"
            ></Image>
          </div>
        </div>
      </section>
    </Layout>
  );
}
