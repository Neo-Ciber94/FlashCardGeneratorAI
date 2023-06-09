import ContrastColor from "contrast-color";
import { FlashCardModel } from "../models/flashcard";

export interface FlashCardProps {
  flashCard: FlashCardModel;
}

export default function FlashCard({ flashCard }: FlashCardProps) {
  const cc = new ContrastColor();
  return (
    <div
      className="shadow-lg px-4 py-8 h-64 w-52 flex flex-row items-center justify-center rounded-lg
       transition-transform hover:scale-110 duration-300 cursor-pointer relative"
      style={{
        backgroundColor: flashCard.color,
        color: cc.contrastColor({ bgColor: flashCard.color }),
        border: `2px solid ${alpha(darken(flashCard.color, 0.05), 1)}`,
      }}
    >
      <p className="text-center font-bold">{flashCard.title}</p>
    </div>
  );
}

function alpha(color: string, alpha: number): string {
  const rr = color.slice(1, 3);
  const gg = color.slice(3, 5);
  const bb = color.slice(5, 7);
  const a = Math.max(1, Math.min(0, alpha)) * 255;
  return `#${rr}${gg}${bb}${a.toString(16)}`;
}

function darken(color: string, percent: number) {
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  r = r * (1 - percent);
  g = g * (1 - percent);
  b = b * (1 - percent);

  r = r < 255 ? r : 255;
  g = g < 255 ? g : 255;
  b = b < 255 ? b : 255;

  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  let rr = r.toString(16).length == 1 ? "0" + r.toString(16) : r.toString(16);
  let gg = g.toString(16).length == 1 ? "0" + g.toString(16) : g.toString(16);
  let bb = b.toString(16).length == 1 ? "0" + b.toString(16) : b.toString(16);

  return "#" + rr + gg + bb;
}
