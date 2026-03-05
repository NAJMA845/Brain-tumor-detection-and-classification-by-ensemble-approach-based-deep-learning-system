const express = require('express');
const router = express.Router();

// In-memory store (replace with DB query in production)
let patients = [];
let nextId = 1;

// GET all patients
router.get('/', (req, res) => {
  try {
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// POST create new patient
router.post('/', (req, res) => {
  try {
    const { firstName, lastName, hospitalId, dob, sex, email, notes } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First and last name required' });
    }
    const newPatient = {
      id: nextId++,
      firstName,
      lastName,
      hospitalId: hospitalId || `H${Date.now()}`,
      dob,
      sex,
      email,
      notes,
      createdAt: new Date(),
    };
    patients.push(newPatient);
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// PUT update patient
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const patientIndex = patients.findIndex(p => p.id === parseInt(id));
    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const { firstName, lastName, hospitalId, dob, sex, email, notes } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First and last name required' });
    }
    patients[patientIndex] = {
      ...patients[patientIndex],
      firstName,
      lastName,
      hospitalId,
      dob,
      sex,
      email,
      notes,
      updatedAt: new Date(),
    };
    res.json(patients[patientIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// DELETE patient
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const patientIndex = patients.findIndex(p => p.id === parseInt(id));
    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const deleted = patients.splice(patientIndex, 1);
    res.json({ message: 'Patient deleted', patient: deleted[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

module.exports = router;
