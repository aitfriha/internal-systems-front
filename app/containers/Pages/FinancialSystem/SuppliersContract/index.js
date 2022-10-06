import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import SuppliersContractBlock from './SuppliersContractBlock';

class SuppliersContractManagement extends React.Component {
  render() {
    const title = brand.name + ' - Suppliers Contract';
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
        <PapperBlock title="Suppliers Contracts List" icon="ios-cash" noMargin overflowX desc="">
          <SuppliersContractBlock />
        </PapperBlock>
      </div>
    );
  }
}

export default SuppliersContractManagement;
