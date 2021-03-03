import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import '../Styles/Editor.css';

export class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: `[
    {
        "filename": "data/GeoClassified_Ellipsoid.laz"
        },
        {
            "type": "writers.gdal",
                    "resolution": 0.000003,
                        "gdaldriver": "GTiff",
            "filename":"temp.tif"
        }
]`,
      outputFilename: 'output.png',
    };
  }

  componentDidMount() {

  }

  updateCode(newCode) {
    this.setState({
      code: newCode,
    });
  }

  render() {
    const {
      filename,
      setLoading,
      refresh,
      closeModal,
    } = this.props;
    const { code, outputFilename } = this.state;

    return (
      <div className="editorContainer">
        <div>
          <span>Pipe Specification for:</span>
          <h1>{filename}</h1>
        </div>
        <AceEditor
          mode="javascript"
          theme="github"
          height={400}
          width={600}
          onChange={(n) => { this.updateCode(n); }}
          name="AceEditor"
          editorProps={{
            $blockScrolling: true,
          }}
          focus
          defaultValue={code}
        />

        <div className="buttonsDiv">
          <input
            type="button"
            className="pipeButton"
            value="Pipe"
            onClick={() => {
              setLoading(true);
              console.log('Making pipe request:', code);
              fetch('http://localhost:8080/api/pipe', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  input_filename: filename,
                  output_filename: outputFilename,
                  spec: JSON.parse(code),
                }),
              }).then(() => {
                refresh();
                setLoading(false);
              });
              closeModal();
            }}
          />
          <input
            type="text"
            className="pipeTextInput"
            placeholder={outputFilename}
            onChange={(e) => {
              this.setState({ outputFilename: e.target.value });
            }}
          />
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  filename: PropTypes.string,
  refresh: PropTypes.func,
  setLoading: PropTypes.func,
  closeModal: PropTypes.func,
};

Editor.defaultProps = {
  filename: 'n/a',
  refresh: null,
  setLoading: null,
  closeModal: null,
};

export default Editor;
