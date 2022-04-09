import React from 'react';

class Ricerca extends React.Component {
    
    render() {

        return(
            <div className='container py-5'>
                <div style={{marginBottom:'100px', width:'70%'}}>
                    <b id='titoloRicerca' style={{color:'white', textShadow:"3px 3px 5px black"}}>Trova la tua casa vacanze o il tuo B&B ideale</b>
                </div>
                <form > 
                    <div className="input-group input-group-lg " id="destinazione" >
                        <input
                            name="destinazione" 
                            onChange={this.props.autocomplete} 
                            value={this.props.destinazione}
                            type="text" 
                            className="form-control" 
                            placeholder="Destinazione" 
                            autoComplete='OFF'
                            required
                        />
                        <button onClick={this.props.cerca} className="btn btn-secondary ml-3"><b>Cerca</b></button>  
                    </div>
                </form>  
                <button onClick={this.props.extra} className="btn btn-secondary mt-3">Filtri</button>                          
            </div>   
        );
    }

}

export default Ricerca;