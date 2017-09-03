const React = require('react');
const styles = require('./styles.css');

/**
 * Preview Component
 * @class Preview
 * @extends {React.Component}
 */
class Preview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            domain: props.domain,
            info: props.info
        }
    }

    render() {

        let inlineStyles =
            "<style>" +
            ".df-heading { font-weight: bold; font-size: 18px; margin-bottom: 10px; }" +
            ".df-label { font-weight: bold; }" +
            ".df-row { margin-bottom: 20px; }" +
            "</style>";
        
        let content = inlineStyles + this.state.info;

        return (
            <div style={{ height: '100%', marginTop: '30px' }}>
                <h1>Who.is information for: {this.state.domain}</h1>


                <div id="domain-info" dangerouslySetInnerHTML={{ __html: content }}></div>
             
            </div>
        )
    }
}

module.exports = Preview
