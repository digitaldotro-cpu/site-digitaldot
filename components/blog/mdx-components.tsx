import Link from "next/link";

export const mdxComponents = {
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-10 text-3xl font-semibold text-white" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 text-2xl font-semibold text-white" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p className="mt-4 text-base leading-relaxed text-[#c8cdd1]" {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-[#c8cdd1]" {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-[#c8cdd1]" {...props} />
  ),
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mt-6 rounded-2xl border-l-4 border-[#66fcf1] bg-[#11181d] px-5 py-4 text-[#d4d9dc]"
      {...props}
    />
  ),
  a: (props: React.ComponentPropsWithoutRef<"a">) => {
    const href = props.href ?? "#";

    if (href.startsWith("/")) {
      return (
        <Link href={href} className="text-[#66fcf1] underline-offset-4 hover:underline">
          {props.children}
        </Link>
      );
    }

    return (
      <a
        {...props}
        className="text-[#66fcf1] underline-offset-4 hover:underline"
        target="_blank"
        rel="noreferrer"
      />
    );
  },
  strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-white" {...props} />
  ),
};
