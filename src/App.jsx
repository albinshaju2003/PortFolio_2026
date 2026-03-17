import NavbarComponent from './components/NavbarComponent';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import './components/CSS/global.css';
import CustomCursor    from './components/CustomCursor';
import EducationSection from './components/EducationSection';


function App() {
  return (
    <>
    <CustomCursor />  
      <NavbarComponent />
      <div id="home">    <HeroSection />     </div>
      <div id="about">   <AboutSection />    </div>
      <div id="projects"><ProjectsSection /> </div>
      <div id="skills">  <SkillsSection />   </div>
      <div id="skills">  <EducationSection />   </div>
      <div id="contact"> <ContactSection />  </div>
      <Footer />
    </>
  );
}

export default App;