const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../database/db');

// Beispiel: Changelog-Daten lesen
router.get('/changelog', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const { language_code } = req.query;

    if (!language_code) {
      return res.status(400).json({ error: 'Language code is required' });
    }

    const [entries] = await connection.execute(`
      SELECT ce.id AS entry_id, ce.version, ce.language_code, ce.title, ce.description, ce.date,
             cd.type, cd.content
      FROM changelog_entries ce
      LEFT JOIN changelog_details cd ON ce.id = cd.entry_id
      WHERE ce.language_code = ?
    `, [language_code]);

    const updates = {};

    entries.forEach(entry => {
      const updateId = entry.entry_id;
      const type = entry.type;
      const content = entry.content;

      if (!updates[updateId]) {
        updates[updateId] = {
          title: entry.title,
          description: entry.description,
          date: entry.date,
          version: entry.version,
          add: [],
          change: [],
          remove: [],
          fixed: []
        };
      }

      if (type && content) {
        if (type === 'addition') {
          updates[updateId].add.push(content);
        } else if (type === 'change') {
          updates[updateId].change.push(content);
        } else if (type === 'removal') {
          updates[updateId].remove.push(content);
        } else if (type === 'fix') {
          updates[updateId].fixed.push(content);
        }
      }
    });

    res.json({ updates });
  } catch (error) {
    console.error('Error querying database:', error.message);
    res.status(500).json({ error: 'Error querying database', details: error.message });
  }
});

// Beispiel: Changelog-Daten hinzufügen
router.post('/changelog', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const { version, language_code, title, description, date, additions, changes, removals, fixes } = req.body;

    await connection.beginTransaction();

    const [result] = await connection.execute(
      'INSERT INTO changelog_entries (version, language_code, title, description, date) VALUES (?, ?, ?, ?, ?)',
      [version, language_code, title, description, date]
    );

    const entryId = result.insertId;

    await insertDetails(connection, entryId, 'addition', additions);
    await insertDetails(connection, entryId, 'change', changes);
    await insertDetails(connection, entryId, 'removal', removals);
    await insertDetails(connection, entryId, 'fix', fixes);

    await connection.commit();

    res.status(201).json({ message: 'Changelog entry created successfully' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error inserting into database:', error);
    res.status(500).json({ error: 'Error inserting into database', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Hilfsfunktion zum Einfügen von Details
async function insertDetails(connection, entryId, type, details) {
  if (details && details.length > 0) {
    for (const detail of details) {
      await connection.execute(
        'INSERT INTO changelog_details (entry_id, type, content) VALUES (?, ?, ?)',
        [entryId, type, detail]
      );
    }
  }
}

// Beispiel: Changelog-Daten aktualisieren
router.put('/changelog/:id', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const entryId = req.params.id;
    const { version, language_code, title, description, date, additions, changes, removals, fixes } = req.body;

    await connection.beginTransaction();

    await connection.execute(
      'UPDATE changelog_entries SET version=?, language_code=?, title=?, description=?, date=? WHERE id=?',
      [version, language_code, title, description, date, entryId]
    );

    await connection.execute('DELETE FROM changelog_details WHERE entry_id=?', [entryId]);

    await insertDetails(connection, entryId, 'addition', additions);
    await insertDetails(connection, entryId, 'change', changes);
    await insertDetails(connection, entryId, 'removal', removals);
    await insertDetails(connection, entryId, 'fix', fixes);

    await connection.commit();

    res.status(200).json({ message: 'Changelog entry updated successfully' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error updating database:', error);
    res.status(500).json({ error: 'Error updating database', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Beispiel: Changelog-Daten löschen
router.delete('/changelog/:id', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const entryId = req.params.id;

    await connection.beginTransaction();

    await connection.execute('DELETE FROM changelog_entries WHERE id=?', [entryId]);
    await connection.execute('DELETE FROM changelog_details WHERE entry_id=?', [entryId]);

    await connection.commit();

    res.status(200).json({ message: 'Changelog entry deleted successfully' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Error deleting entry', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
