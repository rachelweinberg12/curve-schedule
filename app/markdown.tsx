import clsx from "clsx";
import ReactMarkdown from "react-markdown";

export function Markdown(props: { className: string; text?: string }) {
  const { className, text } = props;
  return (
    <ReactMarkdown
      components={{
        ul: ({ node, ...props }) => (
          <ul className="list-disc ml-5" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal ml-5" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        h1: ({ node, ...props }) => (
          <h1 className="text-base font-bold" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-base font-bold" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-base font-bold" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a className="text-orange-500 underline" {...props} />
        ),
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
      }}
      className={clsx(className, "text-sm")}
    >
      {text}
    </ReactMarkdown>
  );
}
