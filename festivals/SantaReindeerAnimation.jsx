import Image from "next/image"; // Assuming you're using Next.js Image component
import santaReindeerImage from "../../assets/images/santa-reindeer-transparent.png"; // Assuming you're using Next.js Image component
import "./SantaReindeerAnimation.css"

const SantaReindeerAnimation = () => {
  return (
    <div className="reindeer-animation"> 
      <Image
      className="w-20 h-20 mobile:w-12 mobile:h-12"
        src={santaReindeerImage}// Path to your transparent image
        alt="Santa on Reindeer"
        width={100} // Adjust the size as needed
        height={100} // Adjust the size as needed
      />
    </div>
  );
};

export default SantaReindeerAnimation;
