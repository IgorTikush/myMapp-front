import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import './LandingPage.css';

export const Landing = (): JSX.Element => {
  const navigate = useNavigate();
  const redirect = (path: string): void => {
    navigate(path);
  };

  return (
    <div className="landing-page">
      <Helmet>
        <title>
          Online Stretch Map - Explore, Share, and Play!
        </title>
        <meta name="description"
          // eslint-disable-next-line max-len
          content="Explore the world, add your photos to places on the map, play games, and learn about different countries. Join us on the Online Stretch Map adventure!" />
        <meta property="og:title" content="Online Stretch Map - Explore, Share, and Play!" />
        <meta property="og:description"
          // eslint-disable-next-line max-len
          content="Explore the world, add your photos to places on the map, play games, and learn about different countries. Join us on the Online Stretch Map adventure!" />
        <meta property="og:image" content="URL_TO_YOUR_APP_LOGO_OR_FEATURED_IMAGE" />
        <meta property="og:url" content="URL_TO_YOUR_LANDING_PAGE" />
      </Helmet>

      <header className="header">
        <h1>
          Welcome to Online Stretch Map!
        </h1>
        <p className="sub-heading">
          Explore the World, Share Your Adventures, and Test Your Knowledge
        </p>
      </header>

      <div className="centered-button">
        <button onClick={(): void => redirect('/signup')} className="sign-up-button">
          Sign Up
        </button>
      </div>

      <section className="features">
        <div className="feature">
          <h2>
            Explore
          </h2>
          <p>
            Discover new places, view amazing photos, and learn interesting facts about different countries.
          </p>
        </div>

        <div className="feature">
          <h2>
            Share Your Adventures
          </h2>
          <p>
            Upload your own photos to the map and share your travel experiences with the world.
          </p>
        </div>

        <div className="feature">
          <h2>
            Test Your Knowledge
          </h2>
          <p>
            Play interactive games to identify countries on the map and challenge your geographical knowledge.
          </p>
        </div>
      </section>

      {/* <footer className="footer">*/}
      {/*  <p>*/}
      {/*    Join us on the Online Stretch Map adventure and broaden your horizons!*/}
      {/*  </p>*/}
      {/* </footer>*/}
    </div>
  );
};
