import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import TypeOfCurrencyBlock from './TypeOfCurrencyBlock';

class TypeOfCurrencyManagement extends React.Component {
  render() {
    const title = brand.name + ' - Type Of Currency';
    const description = brand.desc;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock title="Currency Type Management" icon="ios-cash" noMargin overflowX>
          <TypeOfCurrencyBlock />
        </PapperBlock>
      </div>
    );
  }
}

export default TypeOfCurrencyManagement;
