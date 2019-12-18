const initialState = {
  containers: [],
  nextPos: {x: 0, y: 0, z: 0},
  config: {
      generateTop: false,
      horizontalTolerance: 1,
      wallThickness: 20,
      innerWallThickness: 20,
      maxCaseSize: {x: 1300, y: 1300, z: 500}
  },
  ui: {
      colorsList: [
          "#FFA0A0",
          "#A0FFA0",
          "#A0A0FF"
      ],
      colorsPCB: [
          0xFF0000,
          0x00FF00,
          0x0000FF/*,
          0x60FF60,
          0x8080FF,
          0xFFA0A0,
          0x000000,
          0xFFFFFF*/
      ]
  },
  shields: [
      {
          name: "Stepper Motor HAT v0.2",
          interface: [
              {model: "Raspberry PI 3", offset: {x: 0, y: 0, z: 110}},
              {model: "Raspberry PI 4", offset: {x: 0, y: 0, z: 110}},
          ],

          slimFitZup: [],

          screwHeadDiameter: 50,
          dimX: 650,
          dimY: 560,
          dimZup: 110,
          dimZdown: 90,
          screwPositions: [
                [35, 35],
                [35, 525],
                [615, 35],
                [615, 525]
            ],
          connectors: [
              {
                  name: "M3 & GND & M4",
                  typename: "5x Screw Header 3.5mm",
                  side: 0,
                  pos: {x: 162, y: 0, z: 0},
                  outset: 0,
                  en: 1,
                  dontSplit: true
              },
              {
                  name: "M1 & GND & M2",
                  typename: "5x Screw Header 3.5mm",
                  side: 0,
                  pos: {x: 345, y: 0, z: 0},
                  outset: 0,
                  en: 1,
                  dontSplit: true
              },
              {
                  name: "Power",
                  typename: "Screw Connector 2x5.08mm",
                  side: 0,
                  pos: {x: 528, y: 0, z: 0},
                  outset: 0,
                  en: 1,
                  dontSplit: true
              },
              {
                  name: "PWM / Servo",
                  typename: "4x3 Pin Connector 90",
                  side: 1,
                  pos: {x: 300, y: 0, z: 0},
                  outset: 25,
                  en: 1,
                  dontSplit: true
              },
              {
                  name: "I2C Connector",
                  typename: "4x1 Pin Connector 90",
                  side: 1,
                  pos: {x: 128, y: 0, z: 0},
                  outset: 10,
                  en: 1,
                  dontSplit: true
              },
              {
                  name: "Top GPIO",
                  typename: "GPIO40Top",
                  side: 4,
                  pos: {x: 325, y: 522, z: 0},
                  en: 1,
                  dontSplit: true
              },
          ],
          minZlevel: 110
      },
      {
          name: "Rpi 3 shield",
          interface: [
              {model: "Raspberry PI 3", offset: {x: 0, y: 0, z: 150}},
          ],

          slimFitZup: [],

          screwHeadDiameter: 50,
          dimX: 870,
          dimY: 560,
          dimZup: 160,
          dimZdown: 30,
          screwPositions: [
                [35, 35],
                [35, 525],
                [615, 35],
                [615, 525]
            ],
          connectors: [
              {
                name: "Jack",
                typename: "Jack",
                side: 0,
                pos: {x: 535, y: 0, z: 0},
                outset: 25,
                en: 1,
                dontSplit: true
              },
              {
                name: "HDMI",
                typename: "HDMI",
                side: 0,
                pos: {x: 319, y: 0, z: 0},
                outset: 13,
                en: 1,
                dontSplit: true
              },
              {
                name: "USB Power",
                typename: "MicroUSB",
                side: 0,
                pos: {x: 105, y: -2, z: 0},
                outset: 10,
                en: 1,
                dontSplit: true
              },
              {
                name: "GPIO",
                typename: "GPIO40",
                side: 2,
                pos: {x: 325, y: 60, z: 0},
                outset: 0,
                en: 1,
                dontSplit: true
                },
                  {
                    name: "SDCard",
                    typename: "MicroSD",
                    side: 1,
                    pos: {x: 282, y: -40, z: 0},
                    outset: 30,
                    en: 1,
                    dontSplit: true
                },
                {
                  name: "LAN",
                  typename: "RJ45",
                  side: 3,
                  pos: {x: 105, y: 0, z: 0},
                  outset: 0,
                  en: 1,
                  dontSplit: true
                },
                {
                  name: "USB 1 & 2",
                  typename: "USBBlock2",
                  side: 3,
                  pos: {x: 290, y: 0, z: 0},
                  outset: 0,
                  en: 0,
                  dontSplit: true
                },
                {
                  name: "USB 3 & 4",
                  typename: "USBBlock2",
                  side: 3,
                  pos: {x: 470, y: 0, z: 0},
                  outset: 0,
                  en: 0,
                  dontSplit: true
                },
                {
                  name: "Camera 2",
                  typename: "ZIF 15 Vertical",
                  side: 4,
                  pos: {x: 445, y: 115, z: 0},
                  orientation: 1.570796327,
                  outset: 0,
                  en: 0,
                  dontSplit: true
                }
            ],
            minZlevel: 110
      }
  ],
  models: [
      {
        name: "Raspberry PI 3",
        cat: "Raspberry pi",

        slimFitZup: [100],

        realisticModel: "PCB_RPI3",
        screwHeadDiameter: 50,
        dimX: 870,
        dimY: 560,
        dimZup: 160,
        dimZdown: 30,
        screwPositions: [
              [35, 35],
              [35, 525],
              [615, 35],
              [615, 525]
          ],
        connectors: [
              {
                name: "Jack",
                typename: "Jack",
                side: 0,
                pos: {x: 535, y: 0, z: 0},
                outset: 25,
                en: 0
              },
              {
                name: "HDMI",
                typename: "HDMI",
                side: 0,
                pos: {x: 319, y: 0, z: 0},
                outset: 13,
                en: 1
              },
              {
                name: "USB Power",
                typename: "MicroUSB",
                side: 0,
                pos: {x: 105, y: -2, z: 0},
                outset: 10,
                en: 0
              },
              {
                name: "GPIO",
                typename: "GPIO40",
                side: 2,
                pos: {x: 325, y: 60, z: 0},
                outset: 0,
                en: 1
              },
              {
                name: "Top GPIO",
                typename: "GPIO40Top",
                side: 4,
                pos: {x: 325, y: 522, z: 0},
                en: 1
              },
              {
                name: "SDCard",
                typename: "MicroSD",
                side: 1,
                pos: {x: 282, y: -40, z: 0},
                outset: 30,
                en: 0
              },
              {
                name: "LAN",
                typename: "RJ45",
                side: 3,
                pos: {x: 105, y: 0, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "USB 1 & 2",
                typename: "USBBlock2",
                side: 3,
                pos: {x: 290, y: 0, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "USB 3 & 4",
                typename: "USBBlock2",
                side: 3,
                pos: {x: 470, y: 0, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Camera 2",
                typename: "ZIF 15 Vertical",
                side: 4,
                pos: {x: 445, y: 115, z: 0},
                orientation: 1.570796327,
                outset: 0,
                en: 0
              },
              {
                name: "Camera 1",
                typename: "ZIF 15 Vertical",
                side: 4,
                pos: {x: 45, y: 282, z: 0},
                orientation: -1.570796327,
                outset: 0,
                en: 0
              }
          ],
          minZlevel: 110
      },
      {
        name: "Raspberry PI 4",
        cat: "Raspberry pi",

        slimFitZup: [100],

        realisticModel: "PCB_RPI4",
        screwHeadDiameter: 50,
        dimX: 883,
        dimY: 560,
        dimZup: 160,
        dimZdown: 30,
        screwPositions: [
              [35, 35],
              [35, 525],
              [615, 35],
              [615, 525]
          ],
        connectors: [
              {
                name: "Jack",
                typename: "Jack",
                side: 0,
                pos: {x: 535, y: 0, z: 0},
                outset: 25,
                en: 0
              },
              {
                name: "USB Power",
                typename: "USB 3 Type C",
                side: 0,
                pos: {x: 108, y: 0, z: 0},
                outset: 12,
                en: 1
              },
              {
                name: "GPIO",
                typename: "GPIO40",
                side: 2,
                pos: {x: 325, y: 60, z: 0},
                outset: 0,
                en: 1
              },
              {
                name: "Top GPIO",
                typename: "GPIO40Top",
                side: 4,
                pos: {x: 325, y: 522, z: 0},
                en: 1
              },
              {
                name: "SDCard",
                typename: "MicroSD",
                side: 1,
                pos: {x: 282, y: -40, z: 0},
                outset: 30,
                en: 0
              },
              {
                name: "LAN",
                typename: "RJ45",
                side: 3,
                pos: {x: 445, y: 0, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Micro HDMI 1",
                typename: "MicroHDMI",
                side: 0,
                pos: {x: 260, y: 0, z: 0},
                outset: 15,
                en: 0
              },
              {
                name: "Micro HDMI 2",
                typename: "MicroHDMI",
                side: 0,
                pos: {x: 395, y: 0, z: 0},
                outset: 15,
                en: 0
              },
              {
                name: "2x USB 2",
                typename: "USBBlock2",
                side: 3,
                pos: {x: 85, y: 0, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "2x USB 3",
                typename: "USBBlock2",
                side: 3,
                pos: {x: 270, y: 0, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Camera 2",
                typename: "ZIF 15 Vertical",
                side: 4,
                pos: {x: 445, y: 115, z: 0},
                orientation: 1.570796327,
                outset: 0,
                en: 0
              },
              {
                name: "Camera 1",
                typename: "ZIF 15 Vertical",
                side: 4,
                pos: {x: 45, y: 282, z: 0},
                orientation: -1.570796327,
                outset: 0,
                en: 0
              }
          ],
        minZlevel: 110
      },
      {
        name: "Raspberry PI Zero V1.3",
        screwHeadDiameter: 45,
        cat: "Raspberry pi",

        realisticModel: "PCB_RPI01.3",
        dimX: 650,
        dimY: 300,
        dimZup: 100,
        dimZdown: 20,
        screwPositions: [
              [35, 35],
              [35, 265],
              [615, 35],
              [615, 265]
          ],
        connectors: [
              {
                name: "Mini HDMI",
                typename: "MiniHDMI",
                side: 0,
                pos: {x: 125, y: 0, z: 0},
                outset: 10,
                en: 0
              },
              {
                name: "USB 1",
                typename: "MicroUSB",
                side: 0,
                pos: {x: 412, y: -2, z: 0},
                outset: 15,
                en: 0
              },
              {
                name: "USB 2",
                typename: "MicroUSB",
                side: 0,
                pos: {x: 540, y: -2, z: 0},
                outset: 15,
                en: 0
              },
              {
                name: "GPIO",
                typename: "GPIO40",
                side: 4,
                pos: {x: 325, y: 260, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "SDCard",
                typename: "MicroSD",
                side: 1,
                pos: {x: 175, y: 0, z: 40},
                outset: 30,
                en: 0
              }
          ]
      },
      {
        name: "Arduino Leonardo",
        cat: "Arduino",
        screwHeadDiameter: 40,

        dimX: 690,
        dimY: 535,
        dimZup: 110,
        dimZdown: 28,
        pcbThickness: 18,

        slimFitZup: [40],

        screwPositions: [
              [140, 26],
              [140, 509],
              [664, 76],
              [664, 355]
          ],
        connectors: [
              {
                name: "USB",
                typename: "MicroUSB",
                side: 1,
                pos: {x: 381, y: 0, z: 0},
                outset: 14,
                en: 0
              },
              {
                name: "ICSP",
                typename: "3x2 Pin Connector",
                orientation: 1.570796327,
                side: 4,
                pos: {x: 648, y: 279, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Power Jack",
                typename: "PowerJack6.4mm",
                side: 1,
                pos: {x: 84, y: 0, z: 0},
                outset: 23,
                en: 0
              },
              {
                name: "I2C, GND and pins 8-13",
                typename: "10x1 Pin Connector Female",
                side: 4,
                pos: {x: 302, y: 508, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "pins 0-7",
                typename: "8x1 Pin Connector Female",
                side: 4,
                pos: {x: 546, y: 508, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Power and reset",
                typename: "8x1 Pin Connector Female",
                side: 4,
                pos: {x: 368, y: 25, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Pin A0-A5",
                typename: "6x1 Pin Connector Female",
                side: 4,
                pos: {x: 572, y: 26, z: 0},
                outset: 0,
                en: 0
              }
          ]
      },
      {
        name: "Arduino UNO",
        cat: "Arduino",
        screwHeadDiameter: 40,

        dimX: 690,
        dimY: 535,
        dimZup: 110,
        dimZdown: 28,
        pcbThickness: 18,

        slimFitZup: [40],

        screwPositions: [
              [140, 26],
              [140, 509],
              [664, 76],
              [664, 355]
          ],
        connectors: [
              {
                  name: "USB",
                  typename: "USB 2 Type B",
                  side: 1,
                  pos: {x: 381, y: 381, z: 0},
                  outset: 80,
                  en: 0
              },
              {
                name: "ICSP",
                typename: "3x2 Pin Connector",
                orientation: 1.570796327,
                side: 4,
                pos: {x: 648, y: 279, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Power Jack",
                typename: "PowerJack6.4mm",
                side: 1,
                pos: {x: 84, y: 0, z: 0},
                outset: 54,
                en: 0
              },
              {
                name: "I2C, GND and pins 8-13",
                typename: "10x1 Pin Connector Female",
                side: 4,
                pos: {x: 302, y: 508, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "pins 0-7",
                typename: "8x1 Pin Connector Female",
                side: 4,
                pos: {x: 546, y: 508, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Power and reset",
                typename: "8x1 Pin Connector Female",
                side: 4,
                pos: {x: 368, y: 25, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Pin A0-A5",
                typename: "6x1 Pin Connector Female",
                side: 4,
                pos: {x: 572, y: 26, z: 0},
                outset: 0,
                en: 0
            },
            {
              name: "RX TX 5V GND",
              typename: "4x1 Pin Connector",
              side: 4,
              pos: {x: 625, y: 210, z: 0},
              outset: 0,
              en: 0
            },
            {
                name: "SCL SOA 5V GND",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 625, y: 180, z: 0},
                outset: 0,
                en: 0
            },
            {
              name: "3.3V 3.3V GND GND",
              typename: "4x1 Pin Connector",
              side: 4,
              pos: {x: 625, y: 150, z: 0},
              outset: 0,
              en: 0
            },
            {
                name: "Optional 4pin connector",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 165, y: 230, z: 0},
                outset: 0,
                en: 0
            }
          ]
      },
      {
        name: "12-bit 16 channel PWM",
        cat: "Shield",
        screwHeadDiameter: 40,

        dimX: 625,
        dimY: 250,
        dimZup: 140,
        dimZdown: 15,
        pcbThickness: 18,

        slimFitZup: [80],

        screwPositions: [
              [30, 30],
              [595, 30],
              [595, 220],
              [30, 220]
          ],
        connectors: [
              {
                name: "GND 0-3",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 105, y: 14, z: 0},
                en: 1
              },
              {
                name: "V+ 0-3",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 105, y: 39, z: 0},
                en: 1
              },
              {
                name: "PWM 0-3",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 105, y: 64, z: 0},
                en: 1
              },
              {
                name: "GND 4-7",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 235, y: 14, z: 0},
                en: 1
              },
              {
                name: "V+ 4-7",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 235, y: 39, z: 0},
                en: 1
              },
              {
                name: "PWM 4-7",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 235, y: 64, z: 0},
                en: 1
              },
              {
                name: "GND 8-11",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 388, y: 14, z: 0},
                en: 1
              },
              {
                name: "V+ 8-11",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 388, y: 39, z: 0},
                en: 1
              },
              {
                name: "PWM 8-11",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 388, y: 64, z: 0},
                en: 1
              },
              {
                name: "GND 12-15",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 512, y: 14, z: 0},
                en: 1
              },
              {
                name: "V+ 12-15",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 512, y: 39, z: 0},
                en: 1
              },
              {
                name: "PWM 12-15",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 512, y: 64, z: 0},
                en: 1
              },
              {
                name: "PWM Power",
                typename: "2x1 Screw Header",
                side: 2,
                pos: {x: 308, y: 0, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Data Connector",
                typename: "1x6 right angle header",
                side: 1,
                pos: {x: 125, y: 0, z: 0},
                outset: 65,
                en: 1
              },
              {
                name: "10v 1000micro Capacitor",
                typename: "Capacitor",
                side: 4,
                pos: {x: 120, y: 205, z: 0},
                en: 0
              }
          ]
      },
      {
        name: "5V 10A 2x on-off Relay Module",
        cat: "Shield",
        screwHeadDiameter: 45,

        dimX: 388,
        dimY: 508,
        dimZup: 160,
        dimZdown: 25,
        pcbThickness: 18,

        slimFitZup: [80],

        screwPositions: [
              [25, 30],
              [360, 30],
              [360, 475],
              [25, 475]
          ],
        connectors: [
              {
                name: "Vcc Jumper",
                typename: "1x3 Pin Connector",
                side: 4,
                pos: {x: 120, y: 30, z: 0},
                en: 1
              },
              {
                name: "Data",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 265, y: 30, z: 0},
                en: 1
              },
              {
                name: "Relay 1",
                typename: "Relay 5V on-off",
                side: 4,
                pos: {x: 105, y: 284, z: 0},
                en: 1
              },
              {
                name: "Relay 2",
                typename: "Relay 5V on-off",
                side: 4,
                pos: {x: 270, y: 284, z: 0},
                en: 1
              },
              {
                name: "Screw Connector Relay 1+2",
                typename: "Screw Connector 6x5.08mm",
                side: 2,
                pos: {x: 192, y: 0, z: 0},
                outset: -38,
                en: 1
              }
          ]
      },
      {
        name: "5V 10A 4x on-off Relay Module",
        cat: "Shield",
        screwHeadDiameter: 45,

        dimX: 720,
        dimY: 515,
        dimZup: 160,
        dimZdown: 25,
        pcbThickness: 18,

        slimFitZup: [85],

        screwPositions: [
              [25, 30],
              [695, 30],
              [695, 485],
              [25, 485]
          ],
        connectors: [
              {
                name: "Data",
                typename: "1x6 Pin Connector",
                side: 4,
                pos: {x: 585, y: 42, z: 0},
                en: 1
              },
              {
                name: "Vcc Jumper",
                typename: "2x1 Pin Connector",
                side: 4,
                pos: {x: 692, y: 145, z: 0},
                en: 1
              },
              {
                name: "Relay 1",
                typename: "Relay 5V on-off",
                side: 4,
                pos: {x: 114, y: 312, z: 0},
                en: 1
              },
              {
                name: "Relay 2",
                typename: "Relay 5V on-off",
                side: 4,
                pos: {x: 278, y: 312, z: 0},
                en: 1
              },
              {
                name: "Relay 3",
                typename: "Relay 5V on-off",
                side: 4,
                pos: {x: 442, y: 312, z: 0},
                en: 1
              },
              {
                name: "Relay 4",
                typename: "Relay 5V on-off",
                side: 4,
                pos: {x: 606, y: 312, z: 0},
                en: 1
              },
              {
                name: "Screw Connector Relay 1+2",
                typename: "Screw Connector 6x5.08mm",
                side: 2,
                pos: {x: 210, y: 0, z: 0},
                outset: -30,
                en: 1
              },
              {
                name: "Screw Connector Relay 3+4",
                typename: "Screw Connector 6x5.08mm",
                side: 2,
                pos: {x: 520, y: 0, z: 0},
                outset: -30,
                en: 1
              },
              {
                name: "Screw Holes Relay 1+2",
                typename: "Screw Holes for Connector 6x5.08mm",
                side: 4,
                pos: {x: 210, y: 455, z: 0},
                outset: 0,
                en: 1
              },
              {
                name: "Screw Holes Relay 3+4",
                typename: "Screw Holes for Connector 6x5.08mm",
                side: 4,
                pos: {x: 520, y: 455, z: 0},
                outset: 0,
                en: 1
              }
          ]
      },
      {
        name: "5V 10A 1x on-off Relay Module",
        cat: "Shield",
        screwHeadDiameter: 45,

        dimX: 255,
        dimY: 330,
        dimZup: 160,
        dimZdown: 25,
        pcbThickness: 18,

        slimFitZup: [80],

        screwPositions: [
              [28, 28],
              [227, 28],
              [227, 302],
              [28, 302]
          ],
        connectors: [
              {
                name: "Data",
                typename: "3x1 Pin Connector 90",
                side: 0,
                pos: {x: 165, y: 0, z: 0},
                outset: 45,
                en: 1
              },
              {
                name: "Relay 1",
                typename: "Relay 5V on-off",
                side: 4,
                pos: {x: 139, y: 144, z: 0},
                en: 1
              },
              {
                name: "Screw Connector Relay 1",
                typename: "Screw Connector 3x5.08mm",
                side: 2,
                pos: {x: 135, y: 0, z: 0},
                outset: -12,
                en: 1
              }
          ]
      },
      {
        name: "L298 Motor Driver",
        cat: "Shield",
        screwHeadDiameter: 45,

        dimX: 443,
        dimY: 478,
        dimZup: 120,
        dimZdown: 25,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
              [35, 30],
              [415, 30],
              [415, 410],
              [35, 410]
          ],
        connectors: [
              {
                name: "Out 1 & 2",
                typename: "Screw Connector 2x5.08mm",
                side: 3,
                pos: {x: 295, y: 0, z: 0},
                outset: 0,
                en: 1
              },
              {
                name: "Out 3 & 4",
                typename: "Screw Connector 2x5.08mm",
                side: 1,
                pos: {x: 295, y: 0, z: 0},
                outset: 0,
                en: 1
              },
              {
                name: "12V & GND & 5V",
                typename: "Screw Connector 3x5.08mm",
                side: 2,
                pos: {x: 300, y: 0, z: 0},
                outset: -40,
                en: 1
              },
              {
                name: "In 1 to 4",
                typename: "4x1 Pin Connector",
                side: 4,
                pos: {x: 142, y: 415, z: 0},
                en: 0
              },
              {
                name: "IC controller",
                typename: "Multiwatt Heatsink 23x16x25mm",
                side: 4,
                pos: {x: 225, y: 90, z: 0},
                en: 1
              }
          ]
      },
      {
        name: "Arduino MEAG 2560",
        cat: "Arduino",
        screwHeadDiameter: 40,

        dimX: 1017,
        dimY: 535,
        dimZup: 110,
        dimZdown: 28,
        pcbThickness: 18,

        slimFitZup: [60],

        screwPositions: [
              [140, 26],
              [140, 509],
              [962, 26],
              [897, 509]
          ],
        connectors: [
              {
                name: "USB",
                typename: "USB 2 Type B",
                side: 1,
                pos: {x: 381, y: 0, z: 0},
                outset: 63,
                en: 0
              },
              {
                name: "ICSP",
                typename: "3x2 Pin Connector",
                orientation: 1.570796327,
                side: 4,
                pos: {x: 648, y: 279, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "ICSP 2",
                typename: "3x2 Pin Connector",
                side: 4,
                pos: {x: 178, y: 465, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Power Jack",
                typename: "PowerJack6.4mm",
                side: 1,
                pos: {x: 84, y: 0, z: 0},
                outset: 23,
                en: 0
              },
              {
                name: "I2C, GND and pins 8-13",
                typename: "10x1 Pin Connector Female",
                side: 4,
                pos: {x: 302, y: 508, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "pins 0-7",
                typename: "8x1 Pin Connector Female",
                side: 4,
                pos: {x: 546, y: 508, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "pins 14-21",
                typename: "8x1 Pin Connector Female",
                side: 4,
                pos: {x: 772, y: 508, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "pins 22-53",
                typename: "18x2 Pin Connector Female",
                side: 4,
                pos: {x: 952, y: 293, z: 0},
                orientation: 1.570796327,
                outset: 0,
                en: 0
              },
              {
                name: "Power and reset",
                typename: "8x1 Pin Connector Female",
                side: 4,
                pos: {x: 368, y: 25, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Pin A0-A7",
                typename: "8x1 Pin Connector Female",
                side: 4,
                pos: {x: 597, y: 26, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "Pin A8-A15",
                typename: "8x1 Pin Connector Female",
                side: 4,
                pos: {x: 827, y: 26, z: 0},
                outset: 0,
                en: 0
              }
          ]
      },
      {
        name: "Adafruit UV Light Sensor GUVA-S12SD",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/1918",
        screwHeadDiameter: 45,

        dimX: 100,
        dimY: 190,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
              [51, 159]
          ],
        connectors: [
              {
                name: "Connector",
                typename: "1x3 Pin Connector",
                side: 4,
                pos: {x: 48, y: 26, z: 0},
                outset: 0,
                en: 0
              }
          ]
      },
      {
        name: "Proximity/Light sensor (VCNL4010)",
        cat: "Sensor",
        website: "https://www.adafruit.com/product/466",
        screwHeadDiameter: 45,

        dimX: 165,
        dimY: 180,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
              [25, 152],
              [140, 152]
          ],
        connectors: [
              {
                name: "Connector",
                typename: "1x6 Pin Connector",
                side: 4,
                pos: {x: 82, y: 17, z: 0},
                outset: 0,
                en: 0
              }
          ]
      },
      {
        name: "Adafruit Temperature Sensor Amplifier",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/3328",
        screwHeadDiameter: 45,

        dimX: 255,
        dimY: 280,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
              [25, 254],
              [229, 254]
          ],
        connectors: [
              {
                name: "Connector",
                typename: "1x8 Pin Connector",
                side: 4,
                pos: {x: 127, y: 28, z: 0},
                outset: 0,
                en: 0
              },
              {
                name: "F-",
                typename: "2x1 Screw Header",
                side: 2,
                pos: {x: 93, y: 0, z: 0},
                outset: 0,
                en: 1
              },
              {
                name: "F+",
                typename: "2x1 Screw Header",
                side: 2,
                pos: {x: 165, y: 0, z: 0},
                outset: 0,
                en: 1
              }
          ]
      },
      {
        name: "Adafruit MPRLS Ported Pressure Sensor",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/3965",
        screwHeadDiameter: 45,

        dimX: 178,
        dimY: 167,
        dimZup: 90,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
              [25, 139],
              [152, 139]
          ],
        connectors: [
              {
                name: "Connector",
                typename: "1x7 Pin Connector",
                side: 4,
                pos: {x: 89, y: 25, z: 0},
                outset: 0,
                en: 0
              }
          ]
      },
      {
        name: "Adafruit SGP30 Air Quality Sensor",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/3709",
        screwHeadDiameter: 45,

        dimX: 178,
        dimY: 178,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
              [25, 152],
              [152, 152]
          ],
        connectors: [
              {
                name: "Connector",
                typename: "1x5 Pin Connector",
                side: 4,
                pos: {x: 89, y: 25, z: 0},
                outset: 0,
                en: 0
              }
          ]
      },
      {
        name: "Adafruit Si7021 Temperature & Humidity Sensor",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/3251",
        screwHeadDiameter: 45,

        dimX: 153,
        dimY: 178,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
              [25, 152],
              [127, 152]
          ],
        connectors: [
              {
                name: "Connector",
                typename: "1x5 Pin Connector",
                side: 4,
                pos: {x: 76, y: 25, z: 0},
                outset: 0,
                en: 0
              }
          ]
      },
      {
        name: "INA169 Analog DC Current Sensor",
        cat: "Sensor",
        website: "https://www.adafruit.com/product/1164",
        screwHeadDiameter: 45,

        dimX: 229,
        dimY: 210,
        dimZup: 100,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
              [25, 25],
              [25, 184],
              [203, 25],
              [203, 184]
          ],
        connectors: [
              {
                name: "Connector",
                typename: "1x5 Pin Connector",
                side: 4,
                pos: {x: 114, y: 25, z: 0},
                outset: 0,
                en: 0
              }
          ]
      },
      {
        name: "Adafruit CCS811 Air Quality Sensor",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/3566",
        screwHeadDiameter: 45,

        dimX: 210,
        dimY: 180,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "Adafruit VEML6070 UV Index Sensor",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/2899",
        screwHeadDiameter: 45,

        dimX: 140,
        dimY: 130,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "Contact-less Infrared Thermopile Sensor TMP006",
        cat: "Sensor",
        website: "https://www.adafruit.com/product/1296",
        screwHeadDiameter: 45,

        dimX: 200,
        dimY: 200,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "MCP9808 High Accuracy I2C Temperature Sensor",
        cat: "Sensor",
        website: "https://www.adafruit.com/product/1782",
        screwHeadDiameter: 45,

        dimX: 210,
        dimY: 130,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "INA219 High Side DC Current Sensor",
        cat: "Sensor",
        website: "https://www.adafruit.com/product/904",
        screwHeadDiameter: 45,

        dimX: 229,
        dimY: 200,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "GA1A12S202 Log-scale Analog Light Sensor",
        cat: "Sensor",
        website: "https://www.adafruit.com/product/1384",
        screwHeadDiameter: 45,

        dimX: 100,
        dimY: 130,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "Adafruit 12-Key Capacitive Touch Sensor",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/1982",
        screwHeadDiameter: 45,

        dimX: 330,
        dimY: 190,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "Adafruit VCNL4040 Proximity and Lux Sensor",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/4161",
        screwHeadDiameter: 45,

        dimX: 253,
        dimY: 178,
        dimZup: 70,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "Adafruit HTU21D-F Temperature & Humidity Sensor",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/1899",
        screwHeadDiameter: 45,

        dimX: 180,
        dimY: 160,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "Adafruit LPS35HW Water Resistant Pressure Sensor",
        cat: "Adafruit Sensor",
        website: "https://www.adafruit.com/product/4258",
        screwHeadDiameter: 45,

        dimX: 205,
        dimY: 135,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "MPL115A2 - I2C Barometric Pressure/Temperature Sensor",
        cat: "Sensor",
        website: "https://www.adafruit.com/product/992",
        screwHeadDiameter: 45,

        dimX: 0,
        dimY: 0,
        dimZup: 0,
        dimZdown: 0,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "ADT7410 High Accuracy I2C Temperature Sensor",
        cat: "Sensor",
        website: "https://www.adafruit.com/product/4089",
        screwHeadDiameter: 45,

        dimX: 233,
        dimY: 165,
        dimZup: 40,
        dimZdown: 20,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
          ],
        connectors: [

          ]
      },
      {
        name: "Raspberry pi camera Rev. 1.3",
        cat: "Camera",
        website: "https://www.adafruit.com/product/4089",
        screwHeadDiameter: 40,

        dimX: 235,
        dimY: 245,
        dimZup: 35,
        dimZdown: 25,
        pcbThickness: 18,

        slimFitZup: [],

        screwPositions: [
              [18, 18],
              [140, 18],
              [18, 227],
              [140, 227]
        ],
        connectors: [

        ]
    },
    {
      name: "Joystique 26x33.5",
      cat: "Joystique",
      screwHeadDiameter: 40,

      dimX: 300,
      dimY: 335,
      dimZup: 130,
      dimZdown: 28,
      pcbThickness: 18,

      slimFitZup: [40],

      screwPositions: [
            [35, 30],
            [35, 295],
            [235, 30],
            [235, 295]
        ],
      connectors: [
            {
                name: "Data",
                typename: "5x1 Pin Connector 90",
                side: 2,
                pos: {x: 135, y: 0, z: 0},
                outset: 62,
                en: 1
            },
            {
                name: "Joystick",
                typename: "Joystick 26mm",
                side: 4,
                pos: {x: 145, y: 180, z: 0},
                outset: 62,
                en: 1
            }
        ]
    },
  ]
};

export default initialState;
