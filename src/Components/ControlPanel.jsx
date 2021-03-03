import React from 'react';
import PropTypes from 'prop-types';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { FileDrop } from 'react-file-drop';
import loadingicon from '../loading.svg';
import { ListItemGroup } from './ListItemGroup';
import { Editor } from './Editor';

export class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: null,
      editorVisible: false,
      editorFilename: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  setEditorFilename(fname) {
    this.setState({ editorFilename: fname });
  }

  setLoading(b) {
    this.setState({ loading: b });
  }

  hideEditor() {
    this.setState({ editorVisible: false });
  }

  showEditor() {
    this.setState({ editorVisible: true });
  }

  loadData() {
    // load metadata from API
    this.setState({ loading: true });
    fetch('http://localhost:8080/api/meta')
      .then((response) => response.json())
      .then((data) => {
        const adjustedData = data;
        Object.keys(data).forEach((inFname) => {
          Object.keys(data[inFname]).forEach((outFname) => {
            adjustedData[inFname][outFname]['layer-shown'] = false;
          });
        });
        this.setState({ loading: false, metadata: adjustedData });
      });
  }

  render() {
    const {
      metadata,
      loading,
      editorVisible,
      editorFilename,
    } = this.state;
    const { setLayer, flyTo } = this.props;

    // helper function to turn image layer on
    const updateOutputfileShown = (inFname, outFname, bbox, status) => {
      if (metadata !== {}) {
        const newdata = metadata;
        newdata[inFname][outFname].shown = status;
        setLayer(outFname, bbox, status);
        this.setState({ metadata: newdata });
      }
    };

    return (
      <div className="window">
        <FileDrop
          onDrop={(files) => {
            this.setLoading(true);
            const formData = new FormData();
            formData.append('file', files[0]);
            console.log('File dropped...');
            fetch('http://localhost:8080/api/upload', { method: 'POST', body: formData }).then(() => {
              console.log('uploaded!');
              this.setLoading(false);
              this.loadData();
            });
          }}
        >
          {
            loading
              ? (
                <div className="loadingIndicator">
                  <img alt="loading indicator" src={loadingicon} width={25} height={20} />
                </div>
              ) : null
          }
          <div>
            {
                metadata ? Object.keys(metadata).map((inFname) => (
                  <ListItemGroup
                    key={inFname}
                    showEditor={() => {
                      this.setEditorFilename(inFname);
                      this.showEditor();
                    }}
                    updateFunc={updateOutputfileShown}
                    controlFunction={flyTo}
                    name={inFname}
                    data={metadata[inFname]}
                  />
                )) : null
            }
          </div>
          <div>
            <Rodal
              visible={editorVisible}
              onClose={() => { this.hideEditor(); }}
              animation="zoom"
              height={500}
              width={700}
            >
              <Editor
                setLoading={() => { this.setLoading(); }}
                refresh={() => { this.loadData(); }}
                closeModal={() => { this.hideEditor(); }}
                filename={editorFilename}
              />
            </Rodal>
          </div>
        </FileDrop>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  setLayer: PropTypes.func,
  flyTo: PropTypes.func,
};

ControlPanel.defaultProps = {
  setLayer: null,
  flyTo: null,
};

export default ControlPanel;
