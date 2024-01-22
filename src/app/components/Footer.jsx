import Image from 'next/image';
import authorImage from '../../assets/images/author.jpg';

function Footer() {
    return (
        <footer className="w-full h-auto bg-gray-900 py-4 lg:py-6 px-2 flex flex-wrap justify-center items-center gap-2">
            <div className="text-sm text-gray-200 gap-1 flex items-center px-2">
                <strong className="text-base">Developed by:</strong>
                <a className="flex items-center" href="https://www.facebook.com/sanjoy.rokshit.5" target="_blank" rel="noopener noreferrer">
                    <Image src={authorImage} alt="author" width={25} height={25} className="rounded-full inline-block mr-1" />
                    <span className="text-cyan-400">Sanjoy Rakshit <i className="bi bi-box-arrow-up-right"></i></span>
                </a>
            </div>
            <div className="text-base text-gray-200 font-semibold flex items-center">
                <div className="text-xl">❤️</div>
                <div>
                    <span className="text-orange-500">Love</span> from <span className=" text-green-500">india</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
