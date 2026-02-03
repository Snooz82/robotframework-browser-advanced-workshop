import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: '1. Browser Fundamentals',
    description: (
      <>
        Architecture and setup basics, plus practical logging and troubleshooting. Learn how Browser,
        Context, and Page fit together for stable, isolated tests.
      </>
    ),
    link: '/docs/browser-fundamentals/introduction',
  },
  {
    title: '2. Extending Browser',
    description: (
      <>
        Build custom keywords with the Python Plugin-API, refresh core JavaScript concepts, and implement
        JavaScript extensions with debugging support.
      </>
    ),
    link: '/docs/extending-browser/introduction',
  },
  {
    title: '3. Browser Advanced Keywords (Optional)',
    description: (
      <>
        Advanced waiting and assertions, using Browser from Python, and localization considerations to
        make tests resilient across languages and environments.
      </>
    ),
    link: '/docs/browser-advanced-keywords/introduction',
  }
];

function Feature({title, description, link}: FeatureItem) {
  return (
      <Link to={link} className={clsx('homepage-card')}>
        <div className="card-content text--center padding-horiz--md">
            <Heading as="h2">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="section-content">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
