import * as THREE from 'three';

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  shells: number[]; // Electron count per shell, e.g., [2, 8, 1] for Sodium
}

// Define distinct colors for shells
const shellColors = [
  new THREE.Color(0xff0000), // Red (Shell 1)
  new THREE.Color(0x00ff00), // Green (Shell 2)
  new THREE.Color(0x0000ff), // Blue (Shell 3)
  new THREE.Color(0xffff00), // Yellow (Shell 4)
  // Add more colors if needed for elements beyond Calcium
];

export function getShellColor(shellIndex: number): THREE.Color {
    return shellColors[shellIndex % shellColors.length];
}


export const elements: Record<string, ElementData> = {
  H: { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', shells: [1] },
  He: { atomicNumber: 2, symbol: 'He', name: 'Helium', shells: [2] },
  Li: { atomicNumber: 3, symbol: 'Li', name: 'Lithium', shells: [2, 1] },
  Be: { atomicNumber: 4, symbol: 'Be', name: 'Beryllium', shells: [2, 2] },
  B: { atomicNumber: 5, symbol: 'B', name: 'Boron', shells: [2, 3] },
  C: { atomicNumber: 6, symbol: 'C', name: 'Carbon', shells: [2, 4] },
  N: { atomicNumber: 7, symbol: 'N', name: 'Nitrogen', shells: [2, 5] },
  O: { atomicNumber: 8, symbol: 'O', name: 'Oxygen', shells: [2, 6] },
  F: { atomicNumber: 9, symbol: 'F', name: 'Fluorine', shells: [2, 7] },
  Ne: { atomicNumber: 10, symbol: 'Ne', name: 'Neon', shells: [2, 8] },
  Na: { atomicNumber: 11, symbol: 'Na', name: 'Sodium', shells: [2, 8, 1] },
  Mg: { atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', shells: [2, 8, 2] },
  Al: { atomicNumber: 13, symbol: 'Al', name: 'Aluminum', shells: [2, 8, 3] },
  Si: { atomicNumber: 14, symbol: 'Si', name: 'Silicon', shells: [2, 8, 4] },
  P: { atomicNumber: 15, symbol: 'P', name: 'Phosphorus', shells: [2, 8, 5] },
  S: { atomicNumber: 16, symbol: 'S', name: 'Sulfur', shells: [2, 8, 6] },
  Cl: { atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', shells: [2, 8, 7] },
  Ar: { atomicNumber: 18, symbol: 'Ar', name: 'Argon', shells: [2, 8, 8] },
  K: { atomicNumber: 19, symbol: 'K', name: 'Potassium', shells: [2, 8, 8, 1] },
  Ca: { atomicNumber: 20, symbol: 'Ca', name: 'Calcium', shells: [2, 8, 8, 2] },
};

export const availableElementSymbols = Object.keys(elements);

console.log('Element data loaded:', availableElementSymbols.length, 'elements');
