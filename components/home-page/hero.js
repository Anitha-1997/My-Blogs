import Image from "next/image";
import classes from "./hero.module.css";

export default function Hero() {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image src ="/images/site/anna.jpg" alt="anna" width={200} height={300}/>
      </div>
      <h1>Hi, I'm Anitha</h1>
      <p>
        I blog about web development especially frontend frameworks like React
        or Angular
      </p>
    </section>
  );
}
