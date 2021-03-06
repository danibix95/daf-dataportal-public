import React from 'react';

import DatasetSearchCard from '../components/Dataset/DatasetSearchCard.js'
import CategoryFilter from '../components/Dataset/CategoryFilter.js'
import GroupFilter from '../components/Dataset/GroupFilter.js'
import OrderFilter from '../components/Dataset/OrderFilter.js'
import OrganizationFilter from '../components/Dataset/OrganizationFilter.js'
import AutocompleteDataset from '../components/Autocomplete/AutocompleteDataset.js'

// SERVICES
import DatasetService from '../services/DatasetService';
const datasetService = new DatasetService();

export default class DatasetSearch extends React.Component {

  constructor(props) {
    super(props);

    //init state
    this.state={
      datasets: [],   
      paginator: [],   
      text: props.history.location.state && props.history.location.state.query,
      category_filter: props.history.location.state && props.history.location.state.category,
      group_filter: props.history.location.state && props.history.location.state.group,
      organization_filter: props.history.location.state && props.history.location.state.organization,
      order_filter: "",
      showDivCategory: props.history.location.state?props.history.location.state.isCategoryEnabled:false,
      showDivGroup: false,
      showDivOrganization: false,
      offset: 0,
      totalDataDisplayed: 15,
      totalResult: 0
      /*currentPage: 1,
      activePage: 10 */
        
    };
       
    //bind functions
    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchOrder = this.onSearchOrder.bind(this);
    this.setStateAndsearch = this.setStateAndsearch.bind(this);

    this.handleToggleClickCat = this.handleToggleClickCat.bind(this);
    this.handleToggleClickGroup = this.handleToggleClickGroup.bind(this);
    this.handleToggleClickOrganization = this.handleToggleClickOrganization.bind(this);
    //this.handlePageChange = this.handlePageChange.bind(this); 
    


    /* TODO: da verificare se possono essere eliminati dal costruttore */
    this.search();
    this.searchOrder();
  }

  // inserire anche event con i relativi preventdefault?
  handlePageChange(index) {
   
    
    this.state.offset = index;
    let datasets = datasetService.search(this.state.totalDataDisplayed,this.state.offset,this.state.text, this.state.category_filter, this.state.group_filter, this.state.organization_filter);
    datasets.then((list) => {
      
      this.setState({
        datasets: list.result.results
      });
    });
  }

  handleToggleClickCat() {   
      this.setState(prevState => ({
        showDivCategory: !prevState.showDivCategory
      }));    
  }
  handleToggleClickGroup() {   
    this.setState(prevState => ({
      showDivGroup: !prevState.showDivGroup
    }));    
  }
  handleToggleClickOrganization() {   
    this.setState(prevState => ({
      showDivOrganization: !prevState.showDivOrganization
    }));    
  }

  handleChange(event) {
    console.log('handleChange')
    this.setState({text: event.target.value});
  }

  setStateAndsearch(event){
    console.log()
    this.setState({text: this.refs.auto.state.value});
    this.search();
  }

  
  search(event) {
    console.log('search: ' + this.state.text)
    if(event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    let datasets = datasetService.search(this.state.totalDataDisplayed,this.state.offset,this.state.text, this.state.category_filter, this.state.group_filter, this.state.organization_filter);
    
    datasets.then((list) => {
      let paginator = []; 
      let i = 0;
      let totalResult = list.result.count;
      let totalPage = totalResult/this.state.totalDataDisplayed;
     
      while (i<totalPage) {
        paginator.push(i);        
        i = i+1;       
      }
      this.setState({
        datasets: list.result.results,
        paginator: paginator,
        totalResult: totalResult
      });
    });

    
  }

  onSearch(category_filter, group_filter, organization_filter) {
    if (category_filter) 
    this.setState({
      category_filter: category_filter
    });

    if (group_filter) 
    this.setState({        
      group_filter: group_filter
    });
    if (organization_filter) 
      this.setState({        
        organization_filter: organization_filter
      });
    this.search();
  }

  onSearchOrder(order_filter){

   /*  this.setState({
      order_filter: order_filter
    }); */
    this.state.order_filter = order_filter;
    this.searchOrder();
  }


  searchOrder(event) {
    if(event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    //controllo per problema della prima ricerca
    if(this.state.order_filter){  
      let datasets = datasetService.searchOrder(this.state.totalDataDisplayed,this.state.offset,this.state.order_filter);
      datasets.then((list) => {
        let paginator = []; 
        let i = 0;
        let totalResult = list.result.count;
        let totalPage = totalResult/this.state.totalDataDisplayed;
       
        while (i<totalPage) {
          paginator.push(i);        
          i = i+1;       
        }
        this.setState({
          datasets: list.result.results,
          paginator: paginator,
          totalResult: totalResult
        });
      });
    }

  }


  
  render() {
    return (
        
        <div>
      <div className="u-background-50 u-layout-r-withGutter u-padding-top-xxl">
      <h1 className="u-text-r-l u-textWeight-300 u-color-white u-lineHeight-l">Risultati ricerca</h1>
    </div><div className="u-padding-top-xxl u-background-50"></div>
    <hr className="Separator Separator--up u-background-white" />
    <div className="u-background-white u-layout-r-withGutter u-posRelative u-zindex-30">
        <div className="u-layout-wide u-layoutCenter u-layout-withGutter u-padding-r-top u-padding-bottom-xxl">
          <div className="Grid Grid--withGutter">
            <div className="Grid-cell u-md-size8of12 u-lg-size8of12 u-padding-right-xl">
              
              {/* INTESTAZIONE */}
              <h2 className=" u-padding-bottom-l">Trovati {this.state.totalResult} Dataset</h2>
              <form onSubmit={this.search} className="Form u-text-r-xs u-margin-bottom-l">
                <fieldset className="Form-fieldset">
                  <div className="Form-field Form-field--withPlaceholder Grid u-background-white u-color-grey-30 u-borderRadius-s u-border-all-xxs">
                    <button className="Grid-cell u-sizeFit Icon-search u-color-grey-40 u-text-r-m u-padding-all-s u-textWeight-400">
                    </button>
                    {/*<input value={this.state.text} onChange={this.handleChange} className="Form-input Form-input--ultraLean Grid-cell u-sizeFill u-text-r-s u-color-black u-text-r-xs u-borderHideFocus " required="" id="esplora" name="cerca" />*/}
                    <AutocompleteDataset value={this.state.text} ref="auto"/>
                    <button onClick={this.setStateAndsearch} className="Grid-cell u-sizeFit u-background-60 u-color-white u-textWeight-600 u-padding-r-left u-padding-r-right u-textUppercase u-borderRadius-s">
                      Esplora
                    </button>
                  </div>
                </fieldset>
              </form>

              {/* LISTA RISULTATI */}
              {
                this.state.datasets.map((dataset, index) => {
                  return(
                    <DatasetSearchCard key={index} dataset={dataset}/>
                  );
                })
              }            


              {/*#######################   PAGINAZIONE prova */}
              <nav role="navigation" aria-label="Navigazione paginata" className="u-layout-prose Grid-cell--center u-text-r-xss u-padding-top-xxl u-padding-bottom-l">
                <ul className="Grid Grid--fit Grid--alignMiddle">
                    
                    <li className="Grid-cell u-textCenter">
                        <a onClick={this.handlePageChange.bind(this,0)} className="u-color-50 u-textClean u-padding-all-s" title="Prima Pagina">
                          <span className="Icon-chevron-left u-text-r-s" role="presentation"></span>
                          <span className="u-hiddenVisually">Prima Pagina</span>
                        </a>
                      </li>
                     
                      
                      {
                        this.state.paginator.map((page, index) => {
                          if(index < 3){
                            return(          
                              <li className="Grid-cell u-textCenter u-hidden u-md-inlineBlock u-lg-inlineBlock">                  
                              <a  onClick={this.handlePageChange.bind(this,index)} key={index} aria-label={"Pagina " + index} className="u-padding-all-s u-color-50 u-textClean">
                                <span className="u-text-r-m">{index+1}</span>
                              </a>   
                              </li>                         
                            );
                          } else  if(index == 3){
                            return(         
                              <li className="Grid-cell u-textCenter u-hidden u-md-inlineBlock u-lg-inlineBlock">     
                                 <span className="u-text-r-m u-color-50">...</span>  
                                 </li>                           
                            );
                          } else  if(index > this.state.paginator.length - 3){
                            return(    
                              <li className="Grid-cell u-textCenter u-hidden u-md-inlineBlock u-lg-inlineBlock">          
                              <a  onClick={this.handlePageChange.bind(this,index)} key={index} aria-label={"Pagina " + index} className="u-padding-all-s u-color-50 u-textClean">
                                <span className="u-text-r-m">{index+1}</span>
                              </a>        
                              </li>                     
                            );
                          }
                        })
                        
                      } 

                      <li className="Grid-cell u-textCenter">
                        <a onClick={this.handlePageChange.bind(this,this.state.paginator.length-1)} className="u-padding-all-s u-color-50 u-textClean" title="Ultima Pagina">
                          <span className="Icon-chevron-right u-text-r-s" role="presentation"></span>
                          <span className="u-hiddenVisually">Ultima Pagina</span>
                        </a>
                      </li>
                </ul>
              </nav> 
 </div>
     
            {/* FILTRI RICERCA */}
            <div className="Grid-cell u-sizeFull u-md-size4of12 u-lg-size4of12">
              <form className="Form u-text-r-xs u-padding-bottom-l">
                <fieldset className="Form-fieldset">
                  <h2 className=" u-padding-bottom-m"><label htmlFor="ordinamento">Ordina risultato</label></h2>

                  <div className="Form-field">

                    <OrderFilter order_filter={this.state.order_filter} onSearchOrder={this.onSearchOrder}/>
                  </div>
                </fieldset>
              </form>
              
                
              <h2 className=" u-padding-bottom-l" onClick={this.handleToggleClickCat}>Filtra categorie</h2>  
              {this.state.showDivCategory &&
              <div className="u-sizeFull" id="subnav">
                <CategoryFilter category_filter={this.state.category_filter} onSearch={this.onSearch}/>
              </div> 
              }
              <h2 className=" u-padding-bottom-l" onClick={this.handleToggleClickGroup}>Filtra formati</h2>
              {this.state.showDivGroup &&
              <div className="u-sizeFull" id="subnav">
                <GroupFilter group_filter={this.state.group_filter} onSearch={this.onSearch}/>
              </div>
              }
              
              <h2 className=" u-padding-bottom-l" onClick={this.handleToggleClickOrganization}>Filtra organizzazioni</h2>
              
              {this.state.showDivOrganization &&
              <div className="u-sizeFull" id="subnav">
                <OrganizationFilter organization_filter={this.state.organization_filter}  onSearch={this.onSearch}/>
              </div>
              }

              <a href="#" title="torna all'inizio del contenuto" className="u-hiddenVisually">torna all'inizio del contenuto</a>
            </div>


          </div>
        </div>
        </div>
        </div>
      );
  }
}
