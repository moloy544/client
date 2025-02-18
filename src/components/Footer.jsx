'use client'

import Image from 'next/image';
import authorImage from '../assets/images/india_flag.jpg';
import Link from 'next/link';

const handleEmail = () => {
    const email = 'moviesbazarorg@gmail.com';
    window.location.href = `mailto:${email}`;
};

function Footer() {

    return (
        <footer className="w-full h-auto bg-gray-900 py-4 lg:py-6 px-2 flex flex-col justify-center items-center gap-4 pb-6">
            {/* YouTube Section */}
            <div className="text-center">
                <h3 className="text-2xl mobile:text-base text-white font-semibold mb-3">Subscribe to Our YouTube Channel</h3>
                <p className="text-gray-300 text-base mobile:text-sm mb-4">Stay up-to-date with our latest videos, updates, and exclusive content. Don't miss out on anything!</p>
                <a href="https://www.youtube.com/channel/UCkAFRcc65j_oigFPaBHBerg" target="_blank" rel="noopener noreferrer">
                    <div className="bg-gray-700 text-white py-2.5 px-6 mobile:px-5 mobile:py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-300 inline-flex items-center text-sm mobile:text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-8 h-8">
                            <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z" />
                            <path fill="#FFF" d="M20 31L20 17 32 24z" />
                        </svg>
                        <span className="ml-2">Subscribe Now</span>
                    </div>
                </a>
            </div>
            <div className="text-center">
                <h2 className="text-2xl mobile:text-lg text-gray-300 font-bold my-1">Social links</h2>
                <div className="text-sm text-gray-200 gap-5 mobile:gap-2 flex flex-wrap items-center justify-evenly px-2">
                    <a className="flex items-center gap-1" title="Github" href="https://github.com/sanjoy504" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-github text-[26px]"></i>
                        <span className="text-cyan-400">Github</span>
                    </a>
                    <a className="flex items-center" href="https://www.instagram.com/sanjoyrakshit504/" title="Instagram" target="_blank" rel="noopener noreferrer">
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
                    <a className="flex items-center" href="https://www.facebook.com/sanjoy.rokshit.5" title="Facebook" target="_blank" rel="noopener noreferrer">
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
                    <a className="flex items-center gap-1" title="Github" href="https://t.me/sanjoyrakshit504" target="_blank" rel="noopener noreferrer">
                        <svg
                            width="32px"
                            height="32px"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
                            <path
                                d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z"
                                fill="white"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear_87_7225"
                                    x1="16"
                                    y1="2"
                                    x2="16"
                                    y2="30"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#37BBFE" />
                                    <stop offset="1" stopColor="#007DBB" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="text-cyan-400">Telegram</span>
                    </a>
                    <a
                        className="flex items-center gap-1"
                        title="LinkedIn"
                        href="https://www.linkedin.com/in/sanjoy-rakshit-1796a5287/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            width="34"
                            height="34"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="24" cy="24" r="20" fill="#0077B5" />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M18.7747 14.2839C18.7747 15.529 17.8267 16.5366 16.3442 16.5366C14.9194 16.5366 13.9713 15.529 14.0007 14.2839C13.9713 12.9783 14.9193 12 16.3726 12C17.8267 12 18.7463 12.9783 18.7747 14.2839ZM14.1199 32.8191V18.3162H18.6271V32.8181H14.1199V32.8191Z"
                                fill="white"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M22.2393 22.9446C22.2393 21.1357 22.1797 19.5935 22.1201 18.3182H26.0351L26.2432 20.305H26.3322C26.9254 19.3854 28.4079 17.9927 30.8101 17.9927C33.7752 17.9927 35.9995 19.9502 35.9995 24.219V32.821H31.4922V24.7838C31.4922 22.9144 30.8404 21.6399 29.2093 21.6399C27.9633 21.6399 27.2224 22.4999 26.9263 23.3297C26.8071 23.6268 26.7484 24.0412 26.7484 24.4574V32.821H22.2411V22.9446H22.2393Z"
                                fill="white"
                            />
                        </svg>
                        <span className="text-cyan-400">LinkedIn</span>
                    </a>

                </div>
            </div>

            <div className="text-sm text-gray-400 text-center mx-2 space-y-3">
                <p>
                    <strong>User Safety:</strong> While we strive to ensure safe viewing experiences, users should be aware that some uploaded content may contain copyrighted material. It&lsquo;s our responsibility to monitor content, but we advise users to watch at their discretion.
                </p>
                <p>
                    <strong>Content Safty:</strong> Requests for adult content will be rejected and removed from our site. If you see any content that may be pornographic material, please report it to us via email at <span onClick={handleEmail} className="text-gray-400 font-semibold cursor-pointer">moviesbazarorg@gmail.com</span>.
                </p>
                <p>
                    <strong>Advertisement:</strong> We show some ads, which are important for managing our site. Please ignore them and enjoy your favorite content.
                </p>
                <p>
                    <strong>Privacy policy:</strong>  We have some privacy policies to keep you informed about how we manage data. Please take a moment to read them by clicking the link.
                    <Link href="/privacy-policy/" className="text-blue-200 font-medium ml-1.5">
                        See privery policy
                    </Link>
                </p>
            </div>

            <div className="text-base text-gray-200 font-semibold flex items-center">
                <div className="text-base">❤️</div>
                <div>
                    <span className="text-orange-500">Love</span> from <Image src={authorImage} alt="Indian flag" width={11} height={11} className="rounded-full inline-block" /> <span className=" text-green-500">India</span>
                </div>
            </div>

        </footer>
    );
}

export default Footer;


