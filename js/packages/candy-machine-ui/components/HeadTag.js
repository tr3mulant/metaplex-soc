import Head from 'next/head';
import { useRouter } from 'next/router';
import indexImg from '../images/pages/index.jpg';
import aboutImg from '../images/pages/about.png';
import collectiblesImg from '../images/pages/collectibles.jpg';

const HeadTag = () => {
  const { route } = useRouter();
  let ogImg = indexImg;
  if (route.includes('about')) {
    ogImg = aboutImg;
  }
  if (route.includes('collectibles')) {
    ogImg = collectiblesImg;
  }
  return (
    <Head>
      <title>Seed of Cain Mint</title>
      {/** Social Meta**/}
      <meta property="og:title" content="Psychopomp Comics" />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        name="description"
        content="Seed of Cain Candy Machine."
      />
      <meta property="og:image" content={ogImg.src} />
      <meta
        property="og:url"
        content={`https://psychopompcomics.com${route}`}
      />
      <meta property="og:site_name" content="Psychopomp Comics" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@PsychopompComix" />
      {/** End Social Meta**/}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
        key="apple-touch-icon"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
        key="favicon32"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
        key="favicon16"
      />
      <link rel="manifest" href="/site.webmanifest" key="manifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
      <meta
        name="msapplication-TileColor"
        content="#000000"
        key="msapplication-TileColor"
      />
      <meta name="theme-color" content="#000000" key="theme-color" />
    </Head>
  );
};

export default HeadTag;
