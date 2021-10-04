const atlas = require('azure-maps-control')

module.exports = {
  control: {
    DrawingToolbar: jest.fn(options => ({
      setOptions: jest.fn()
    }))
  },
  drawing: {
    DrawingManager: jest.fn((map, options) => {
      let toolbar;
      const dataSource = new atlas.source.DataSource()
      map.sources.add(dataSource)
      return {
        setOptions: jest.fn(options => {
          if(!toolbar){
            map.controls.add(options.toolbar)
          } else if (toolbar !== options.toolbar){
            map.control.remove(toolbar)
            map.control.add(options.toolbar)
          }
          toolbar = options.toolbar
        }),
        getOptions: jest.fn(() => ({})),
        dispose: jest.fn(),
        getLayers: jest.fn(() => ({
          lineLayer: {
            layer: 'LineLayer',
            setOptions: jest.fn()
          },
          polygonLayer: {
            layer: 'PolygonLayer',
            setOptions: jest.fn()
          },
          polygonOutlineLayer: {
            layer: 'LineLayer',
            setOptions: jest.fn()
          },
          pointLayer: {
            layer: 'SymbolLayer',
            setOptions: jest.fn()
          }
        })),
        getSource: jest.fn(() => dataSource)
      }
    })
  }
}