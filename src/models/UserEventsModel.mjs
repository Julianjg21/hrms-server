import db from "../config/Database.mjs";

export const createNewEventModel = async (eventData) => {
  try {
    // Insert a new event into the database
    const [rows] = await db.query(
      "INSERT INTO events (id_user, title, ubication, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)",
      [
        eventData.userId,
        eventData.title,
        eventData.ubication,
        eventData.startDate,
        eventData.endDate,
        eventData.description,
      ]
    );
    return rows;
  } catch (error) {
    throw error; // Handle error
  }
};

export const updateEventModel = async (eventData) => {
  try {
    // Update the event in the database
    const [rows] = await db.query(
      "UPDATE events SET title = ?, ubication = ?, start_date = ?, end_date = ?, description = ? WHERE id_event = ?",
      [
        eventData.title,
        eventData.ubication,
        eventData.startDate,
        eventData.endDate,
        eventData.description,
        eventData.eventId,
      ]
    );
    return rows;
  } catch (error) {
    throw error; // Handle error
  }
};

export const getAllEventsModel = async (userId) => {
  try {
    // Get all events for the user from the database
    const [rows] = await db.query("SELECT * FROM events WHERE id_user = ?", [
      userId,
    ]);
    return rows;
  } catch (error) {
    throw error; // Handle error
  }
};

export const deleteEventModel = async (eventId) => {
  try {
    // Delete the event from the database
    const [rows] = await db.query("DELETE FROM events WHERE id_event = ?", [
      //
      eventId,
    ]);
    return rows;
  } catch (error) {
    throw error; // Handle error
  }
};
