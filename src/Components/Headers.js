// import React, { useState } from 'react';
// import './Headers.css';
// import {
//   Container,
//   Navbar,  
//   NavbarBrand,
// } from 'reactstrap';

// function Headers() { 

//   return (
//     <div>
//       <Navbar id='my-navbar' >
//         <Container>
//           <div className="d-flex align-items-center">
//             <NavbarBrand href = "/">
//               <img                 
//                 alt="logo" 
//                 src="https://pixis.ai/wp-content/uploads/2023/02/logo.svg"
//                 style={{
//                   position: 'absolute',
//                   left: '3%',
//                   transform: 'translateX(-50%)', 
//                   right: '1%',
//                   transform: 'translateY(-45%)',
//                   width: 120 
//                 }}  
//               />
//             </NavbarBrand>
//             <span className="App-Heading">Text Removal app</span>
//           </div>
//         </Container>
//       </Navbar>
//     </div>
//   );
  
// }

// export default Headers;
import React from 'react';
import './Headers.css';
import {
  Container,
  Navbar,  
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

function Headers() { 

  return (
    <div>
      <Navbar id='my-navbar' >
        <Container>
          <div className="d-flex align-items-center justify-content-between">
            <NavbarBrand href="/">
              <img                 
                alt="logo" 
                src="https://pixis.ai/wp-content/uploads/2023/02/logo.svg"
                style={{                  
                  width: 120 
                }}  
              />
            </NavbarBrand>

            <span className="App-Heading">Text Removal app <sub className='mt-4' style={{fontSize:"12px",color:"#388EF6"}}>beta</sub></span>

            <Nav>
              <NavItem>
                <NavLink 
                  href="https://docs.google.com/document/d/155l2xvbhQBIUVqcZ11iKo7H40bucEB23ymo5pCnFAjA/edit?usp=sharing" 
                  style={{
                    color: '#3989F6', 
                    border: '1px solid #3989F6',
                    padding: '7px', 
                    marginLeft:'20px',
                    borderRadius: '5px', 
                    backgroundColor: 'transparent',
                    fontSize: '0.5rem' // Add this
                  }}>
                  Documentation
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

export default Headers;




