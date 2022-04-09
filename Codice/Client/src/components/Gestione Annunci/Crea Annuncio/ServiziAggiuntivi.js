import React from "react";
import ServizioAggiuntivo from "./ServizioAggiuntivo.js"


//I servizi aggiuntivi non sono inizialmente visibili nel form. Al click della freccia vengono renderizzati

class ServiziAggiuntivi extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            visibile: false    
        }
    }

    //Gestisco la modifica dello state ogni volta che viene cliccata la freccia
    handleClick = () => {
        this.setState(prevState => {
            return {
                visibile: !prevState.visibile
            }
        });
    }

    render()
    {
        // Se lo state.visibile è false renderizzo solamente la freccia 
        if(!this.state.visibile)
        {
            return (
                <label className="lead mt-5" onClick={this.handleClick}>
                    Servizi Aggiuntivi&nbsp;
                    <img id="freccia" alt="espandi" src="/images/icon/icons8-freccia-espandi-16.png" />
                </label>
            );
        }
        // Altrimenti renderizzo tutte le checkbox per la selezione dei serviz aggiuntivi
        else
        {
            return(
                <div>
                    <label className="lead mt-5" onClick={this.handleClick}>
                        Servizi Aggiuntivi&nbsp;
                        <img id="freccia" alt="comprimi" src="/images/icon/icons8-freccia-comprimi-16.png" />
                    </label>
                    <div id="serviziAggiuntivi" className="form-row mt-2">
                        <div className="mt-3 col-md-6 col-sm-12 pl-5">
                            <label className="lead" style={{fontSize: "1.5em"}}>Servizi Accessori</label>

                            <ServizioAggiuntivo 
                                name="wifi"
                                label="Connessione Wifi"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />

                            <ServizioAggiuntivo 
                                name="televisore"
                                label="Televisore"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />       

                            <ServizioAggiuntivo 
                                name="ascensore"
                                label="Ascensore"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />

                            
                            <ServizioAggiuntivo 
                                name="parcheggio"
                                label="Parcheggio Privato"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   


                            <ServizioAggiuntivo 
                                name="animali"
                                label="Animali Non Ammessi"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   


                            <ServizioAggiuntivo 
                                name="fumatori"
                                label="Fumatori Non Ammessi"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   


                            <ServizioAggiuntivo 
                                name="ariaCondizionata"
                                label="Aria Condizionata"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   


                            <ServizioAggiuntivo 
                                name="riscaldamenti"
                                label="Riscaldamenti"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   
                            

                            <ServizioAggiuntivo 
                                name="trasporti"
                                label="Trasporti Pubblici Nelle Vicinanze"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   
                        </div>

                        <div className="mt-3 col-md-6 col-sm-12 pl-5">
                            <label className="lead" style={{fontSize: "1.5em"}}>Elettrodomestici</label>

                            <ServizioAggiuntivo 
                                name="microonde"
                                label="Microonde"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />     

                            <ServizioAggiuntivo 
                                name="lavastoviglie"
                                label="lavastoviglie"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />    

                            <ServizioAggiuntivo 
                                name="frigorifero"
                                label="Frigorifero"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   
                            
                            <ServizioAggiuntivo 
                                name="forno"
                                label="Forno"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   

                            <ServizioAggiuntivo 
                                name="lavabiancheria"
                                label="Lavabiancheria"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   

                            <ServizioAggiuntivo 
                                name="asciugatrice"
                                label="Asciugatrice"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   

                            <ServizioAggiuntivo 
                                name="phon"
                                label="Phon"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   
                            
                            <ServizioAggiuntivo 
                                name="ferroDaStiro"
                                label="Ferro Da Stiro"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   
                        </div>
                    
                        <div className="mt-3 col-md-6 col-sm-12 pl-5">
                            <label className="lead" style={{fontSize: "1.5em"}}>Sicurezza</label>

                            <ServizioAggiuntivo 
                                name="telecamere"
                                label="Telecamere Di Sicurezza"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   

                            <ServizioAggiuntivo 
                                name="estintore"
                                label="Estintore"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   

                            <ServizioAggiuntivo 
                                name="allarmeFurto"
                                label="Allarme Antiurto"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   

                            <ServizioAggiuntivo 
                                name="allarmeIncendio"
                                label="Allarme Antincendio"    
                                state={this.props.state}
                                handleChange={this.props.handleChange}
                            />   
                        </div>
                    </div>
                </div>
            );
        }
    };
};

export default ServiziAggiuntivi;