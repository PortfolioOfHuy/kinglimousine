"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    CKEDITOR?: any;
    __ckeditor4Loader?: Promise<any>;
  }
}

type Props = {
  name: string;
  defaultValue?: string;
  className?: string;
};

function loadCkeditor4() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window is undefined"));
  }

  if (window.CKEDITOR) {
    return Promise.resolve(window.CKEDITOR);
  }

  if (window.__ckeditor4Loader) {
    return window.__ckeditor4Loader;
  }

  window.__ckeditor4Loader = new Promise((resolve, reject) => {
    const existed = document.querySelector(
      'script[data-ckeditor4="true"]',
    ) as HTMLScriptElement | null;

    if (existed) {
      existed.addEventListener(
        "load",
        () => {
          if (window.CKEDITOR) resolve(window.CKEDITOR);
          else reject(new Error("CKEDITOR not found after script load"));
        },
        { once: true },
      );

      existed.addEventListener(
        "error",
        () => reject(new Error("Failed to load CKEditor 4")),
        { once: true },
      );

      return;
    }

    const script = document.createElement("script");
    script.src = "/ckeditor4/ckeditor.js";
    script.async = true;
    script.dataset.ckeditor4 = "true";

    script.onload = () => {
      if (window.CKEDITOR) resolve(window.CKEDITOR);
      else reject(new Error("CKEDITOR not found after script load"));
    };

    script.onerror = () => reject(new Error("Failed to load CKEditor 4"));

    document.body.appendChild(script);
  });

  return window.__ckeditor4Loader;
}

export default function Ckeditor4Field({
  name,
  defaultValue = "",
  className,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const [value, setValue] = useState(defaultValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(defaultValue || "");

    if (editorRef.current) {
      const current = editorRef.current.getData?.() ?? "";
      if (current !== (defaultValue || "")) {
        editorRef.current.setData(defaultValue || "");
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        const CKEDITOR = await loadCkeditor4();
        if (cancelled) return;

        const textarea = textareaRef.current;
        if (!textarea || !textarea.isConnected) return;

        rafRef.current = window.requestAnimationFrame(() => {
          if (cancelled) return;
          if (!textareaRef.current || !textareaRef.current.isConnected) return;
          if (editorRef.current) return;

          const existingInstanceName = textareaRef.current.name;
          if (
            existingInstanceName &&
            CKEDITOR.instances?.[existingInstanceName]
          ) {
            CKEDITOR.instances[existingInstanceName].destroy(true);
          }

          const editor = CKEDITOR.replace(textareaRef.current, {
            height: 380,
            allowedContent: true,
            extraAllowedContent: "*(*);*{*};*[*]",
            // Tạm thời chưa dùng config cũ để tránh xung đột
            // customConfig: '/ckeditor4/config.js',
          });

          const syncValue = () => {
            const data = editor.getData?.() || "";
            setValue(data);
          };

          editor.on("instanceReady", () => {
            if (cancelled) return;
            editor.setData(defaultValue || "");
            syncValue();
            setReady(true);
          });

          editor.on("change", syncValue);
          editor.on("blur", syncValue);
          editor.on("afterCommandExec", syncValue);

          editorRef.current = editor;
        });
      } catch (error) {
        console.error("CKEditor 4 init error:", error);
      }
    };

    boot();

    return () => {
      cancelled = true;

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (editorRef.current) {
        try {
          editorRef.current.destroy(true);
        } catch (error) {
          console.error("CKEditor 4 destroy error:", error);
        }
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <input type="hidden" name={name} value={value} readOnly />

      {!ready ? (
        <div className="editorLoading">Đang tải trình soạn thảo...</div>
      ) : null}

      <textarea
        ref={textareaRef}
        name={`${name}__editor`}
        defaultValue={defaultValue}
        className={className}
        style={!ready ? { opacity: 0 } : undefined}
      />
    </>
  );
}
