function BlockShape({ shape, color }) {
	return (
	  <div className="block-shape">
		{shape.map((row, rowIndex) => (
		  <div key={rowIndex} className="block-shape-row">
			{row.map((cell, cellIndex) => (
			  <div
				key={cellIndex}
				className={`block-shape-cell ${cell ? 'filled' : ''}`}
				style={{ backgroundColor: cell ? color : 'transparent' }}
			  ></div>
			))}
		  </div>
		))}
	  </div>
	);
  }
  

  function ColorPicker(props) {
	const handleColorChange = (event, blockId) => {
	  const newColor = event.target.value;
	  document.documentElement.style.setProperty(`--block-color-${blockId}`, newColor);
	};
  
	const blockShapes = [
	  { shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], id: 1 },
	  { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], id: 2 },
	  { shape: [[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]], id: 3 },
	  { shape: [[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]], id: 4 },
	  { shape: [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]], id: 5 },
	  { shape: [[0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0]], id: 6 },
	  { shape: [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0]], id: 7 },
	];
  
	return (
	  <div className="color-picker-container">
		{blockShapes.map((block, i) => (
		  <div key={i} className="color-picker-item">
			<BlockShape shape={block.shape} color={`var(--block-color-${i + 1})`} />
			<input
			  type="color"
			  id={`color-picker-${i + 1}`}
			  onChange={(event) => handleColorChange(event, i + 1)}
			  style={{ display: 'none' }}
			/>
			<button
			  className="color-picker-button"
			  style={{
				backgroundColor: `var(--block-color-${i + 1})`,
			  }}
			  onClick={() => document.getElementById(`color-picker-${i + 1}`).click()}
			></button>
		  </div>
		))}
	  </div>
	);
  }
  
  export default ColorPicker;
  