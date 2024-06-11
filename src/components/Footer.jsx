import Image from 'next/image';
import authorImage from '../assets/images/author.jpg';

function Footer() {
    return (
        <footer className="w-full h-auto bg-gray-900 py-4 lg:py-6 px-2 flex flex-wrap justify-center items-center gap-2">

            <div className="text-sm text-gray-200 gap-5 mobile:gap-2 flex flex-wrap items-center justify-center px-2">

                <a className="flex items-center gap-1" href="https://github.com/sanjoy504" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-github text-[26px]"></i>
                    <span className="text-cyan-400">Github</span>
                </a>

                <a className="flex items-center" href="https://www.instagram.com/sanjoyrakshit504/" target="_blank" rel="noopener noreferrer">
                    <svg
                        width="34px"
                        height="34px"
                        viewBox="-3.2 -3.2 38.40 38.40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
                    >
                        <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#paint0_radial_87_7153)" />
                        <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#paint1_radial_87_7153)" />
                        <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#paint2_radial_87_7153)" />
                        <path d="M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z" fill="white" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z" fill="white" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z" fill="white" />
                        <defs>
                            <radialGradient id="paint0_radial_87_7153" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 23) rotate(-55.3758) scale(25.5196)">
                                <stop stopColor="#B13589" />
                                <stop offset="0.79309" stopColor="#C62F94" />
                                <stop offset="1" stopColor="#8A3AC8" />
                            </radialGradient>
                            <radialGradient id="paint1_radial_87_7153" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11 31) rotate(-65.1363) scale(22.5942)">
                                <stop stopColor="#E0E8B7" />
                                <stop offset="0.444662" stopColor="#FB8A2E" />
                                <stop offset="0.71474" stopColor="#E2425C" />
                                <stop offset="1" stopColor="#E2425C" stopOpacity="0" />
                            </radialGradient>
                            <radialGradient id="paint2_radial_87_7153" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)">
                                <stop offset="0.156701" stopColor="#406ADC" />
                                <stop offset="0.467799" stopColor="#6A45BE" />
                                <stop offset="1" stopColor="#6A45BE" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>
                    <span className="text-cyan-400">Instagram</span>
                </a>

                <a className="flex items-center" href="https://www.facebook.com/sanjoy.rokshit.5" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 48 48">
                        <linearGradient id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#2aa4f4"></stop>
                            <stop offset="1" stopColor="#007ad9"></stop>
                        </linearGradient>
                        <path fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path>
                        <path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"></path>
                    </svg>
                    <span className="text-cyan-400">Facebook</span>
                </a>
               
            </div>

            <div className="text-base text-gray-200 font-semibold flex items-center">
                <div className="text-xl">❤️</div>
                <div>
                    <span className="text-orange-500">Love</span> fr<Image src={authorImage} alt="Indian flag" width={11} height={11} className="rounded-full inline-block" />m <span className=" text-green-500">india</span>
                </div>
            </div>

        </footer>
    )
}

export default Footer
