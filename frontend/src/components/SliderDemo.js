// import React, { Component } from "react";
// // import OwlCarousel from "react-owl-carousel";
// // import "owl.carousel/dist/assets/owl.carousel.css";
// // import "owl.carousel/dist/assets/owl.theme.default.css";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

// import "../assets/css/style.css";

// export default class SliderDemo extends Component {
//   render() {
//     const options = {
//       items: 3,

//       margin: 25,
//       dots: false,
//       //   responsive: {
//       //     0: {
//       //       items: 1,
//       //     },
//       //     600: {
//       //       items: 2,
//       //     },
//       //     1000: {
//       //       items: 3,
//       //     },
//       //   },
//     };

//     const responsive = {
//       superLargeDesktop: {
//         // the naming can be any, depends on you.
//         breakpoint: { max: 4000, min: 3000 },
//         items: 5,
//       },
//       desktop: {
//         breakpoint: { max: 3000, min: 1024 },
//         items: 3,
//       },
//       tablet: {
//         breakpoint: { max: 1024, min: 464 },
//         items: 2,
//       },
//       mobile: {
//         breakpoint: { max: 464, min: 0 },
//         items: 1,
//       },
//     };

//     return (
//       <div>
//         <Carousel
//           responsive={responsive}
//           showDots={false}
//           arrows={false}
//           margin={20}
//         >
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//         </Carousel>

//         <Carousel
//           responsive={responsive}
//           showDots={false}
//           arrows={false}
//           margin={20}
//         >
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//         </Carousel>

//         {/* <OwlCarousel margin={20} items={2}>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//         </OwlCarousel>

//         <OwlCarousel margin={20} items={2}>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//           <div className="">
//             <video id="video1" height="auto">
//               <source src={`../assets/video/test2.mp4`} type="video/mp4" />
//               <source src={`mov_bbb.ogg" type="video/ogg"`} />
//             </video>
//           </div>
//         </OwlCarousel> */}
//       </div>
//     );
//   }
// }
