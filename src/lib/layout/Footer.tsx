import { AiFillGithub } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="h-32 flex flex-col items-center justify-center p-4 ">
      <hr className="w-full border border-gray-100 mb-5"/>
      <div className="flex flex-row justify-center my-2">
        <a href="https://github.com/Neo-Ciber94/FlashCardGeneratorAI" className="hover:text-red-400">
          <AiFillGithub size={30}/>
        </a>
      </div>
      <small className="text-red-500">SmartFlash - &copy; {new Date().getFullYear()}</small>
    </footer>
  );
}
