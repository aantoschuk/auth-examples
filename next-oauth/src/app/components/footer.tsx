export const Footer = () => {
  return (
    <>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://nextjs.org/docs"
        target="_blank"
        rel="noopener noreferrer"
      >
        Next
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://auth0.com/docs/authenticate/protocols/oauth"
        target="_blank"
        rel="noopener noreferrer"
      >
        OAuth 2.0
      </a>

      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://next-auth.js.org/configuration/providers/oauth#built-in-providers"
        target="_blank"
        rel="noopener noreferrer"
      >
        Next OAuth
      </a>
    </>
  );
};
