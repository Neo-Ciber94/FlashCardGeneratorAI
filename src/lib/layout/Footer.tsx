import { AiFillGithub } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="flex h-32 flex-col items-center justify-center p-4 ">
      <hr className="mb-5 w-full border border-gray-100 dark:border-white/10" />
      <div className="my-2 flex flex-row justify-center">
        <a
          href="https://github.com/Neo-Ciber94/FlashCardGeneratorAI"
          className="hover:text-red-400"
        >
          <AiFillGithub size={30} className="dark:invert" />
        </a>
      </div>
      <small className="text-red-500">
        SmartFlash - &copy; {new Date().getFullYear()}
      </small>
    </footer>
  );
}
