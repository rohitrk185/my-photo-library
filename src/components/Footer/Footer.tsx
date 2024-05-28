import Container from "@/components/Container";

const Footer = () => {
  return (
    <footer className="mt-20">
      <Container className="p-6">
        <p className="text-center text-zinc-500">
          Built with{" "}
          <a
            className="underline font-medium text-inherit"
            href="https://cloudinary.com/"
            target="_blank"
          >
            Cloudinary
          </a>{" "}
          &amp;{" "}
          <a
            className="underline font-medium text-inherit"
            href="https://nextjs.org/"
            target="_blank"
          >
            Next.js
          </a>{" "}
          by{" "}
          <a
            className="underline font-medium text-inherit"
            target="_blank"
            href="https://github.com/rohitrk185"
          >
            Rohit Kumar R
          </a>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
