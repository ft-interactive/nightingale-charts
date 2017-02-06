module.exports = {
  config : {
    barChart : {
      comment: 'Bar chart',
      title: 'Bars: ',
      subtitle: 'Categories, with a vertical independent axis',
      dependentAxisOrient: 'bottom',
      independentAxisOrient: 'left',
      stack: false,
      dataType : 'categorical'
    },
    columnChart : {
      theme: 'ft-web',
      comment: 'Column chart',
      title: 'Video Ratio: ',
      subtitle: 'Cheeky subtitle',
      source: 'with a source',
      footnote: 'my footnote',
      dependentAxisOrient: 'right',
      independentAxisOrient: 'bottom',
      dataType : 'categorical'
    },
    lineChart : {
      comment: 'Line chart',
      title: 'Lines: ',
      subtitle: 'Dates, with a vertical independent axis',
      dependentAxisOrient: 'left',
      independentAxisOrient: 'bottom',
      footnote: "This is another way of doing things which i enjoy",
      source: "This is a source, a very lengthy one at that, so that we can test the layout",
      dataType : 'time',
      keyHover: true,
    },
    sizes : {
      small : {
        width: 200
      },
      medium : {
        width: 300
      },
      large : {
        width: 600
      }
    }
  }
}
