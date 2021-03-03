import '../Styles/Thumbnail.css';
import React from 'react';
import PropTypes from 'prop-types';

function ListItem(props) {
  const { shown, bbox, filename } = props;

  const handleClick = () => {
    const x = (bbox[0][0] + bbox[1][0]) / 2;
    const y = (bbox[0][1] + bbox[1][1]) / 2;
    props.controlFunction(x, y);
  };

  return (
    <li className="item">
      <input
        checked={shown}
        onChange={(e) => {
          props.toggle(!e.target.checked);
        }}
        type="checkbox"
      />
      <button
        type="button"
        onKeyDown={handleClick}
        onClick={handleClick}
      >
        <img alt="thumbnail" src={`http://localhost:8080/api/thumbnail/${filename}`} />
        {filename}
      </button>
    </li>
  );
}

export function ListItemGroup(props) {
  const {
    data, name, showEditor, controlFunction, updateFunc,
  } = props;
  return (
    <div key={name} className="itemgroup">
      <button
        type="button"
        className="itemgroupTitle"
        onClick={showEditor}
        onKeyDown={showEditor}
      >
        {name}
      </button>
      {Object.keys(data).map((outFname) => {
        const { bbox } = data[outFname];
        return (
          <ListItem
            key={outFname}
            shown={data.shown}
            filename={outFname}
            bbox={bbox}
            controlFunction={controlFunction}
            toggle={(shown) => {
              updateFunc(props.name, outFname, bbox, shown);
            }}
          />
        );
      })}
    </div>
  );
}

ListItem.propTypes = {
  shown: PropTypes.bool,
  controlFunction: PropTypes.func,
  toggle: PropTypes.func,
  filename: PropTypes.string,
  bbox: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
};

ListItem.defaultProps = {
  shown: null,
  controlFunction: null,
  toggle: null,
  filename: null,
  bbox: null,
};

ListItemGroup.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  name: PropTypes.string,
  controlFunction: PropTypes.func,
  updateFunc: PropTypes.func,
  showEditor: PropTypes.func,
};
ListItemGroup.defaultProps = {
  data: null,
  name: null,
  showEditor: null,
  controlFunction: null,
  updateFunc: null,
};

export default ListItemGroup;
