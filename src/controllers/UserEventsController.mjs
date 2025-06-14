import {
  createNewEventModel,
  updateEventModel,
  getAllEventsByDateModel,
  deleteEventModel,
} from "../models/UserEventsModel.mjs";
import * as Sentry from "@sentry/node";

// Function to create a new event
export const createNewEvent = async (req, res) => {
  const eventData = req.body; // Get the event data from the request body
  try {
    await createNewEventModel(eventData); // Call the model function to create a new event
    return res.status(200).json({
      status: "success",
      message: "Evento creado con exito",
    });
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    //If there has been an error, return a 500 error
    return res
      .status(500)
      .json({ message: "Error trying to save the new event" });
  }
};

// Function to update an existing event
export const updateEvent = async (req, res) => {
  const eventData = req.body; // Get the event data from the request body
  try {
    await updateEventModel(eventData); // Call the model function to update the event
    return res.status(200).json({
      status: "success",
      message: "Evento actualizado con exito",
    });
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    //If there has been an error, return a 500 error
    return res
      .status(500)
      .json({ message: "Error trying to update the event" });
  }
};

// Function to get all events for a user
export const getAllEventsByDate = async (req, res) => {
  const { date } = req.params; // Obtén la fecha desde los parámetros de la ruta
console.log("Date received:", date); // Log the date for debugging
 // Get the user ID from the request parameters
  try {
    const events = await getAllEventsByDateModel(date); // Call the model function to get all events for the user
    return res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    //If there has been an error, return a 500 error
    return res.status(500).json({ message: "Error trying to get the events" });
  }
};



// Function to delete an event
export const deleteEvent = async (req, res) => {
  const eventId = req.params.idEvent; // Get the event ID from the request parameters
  try {
    await deleteEventModel(eventId); // Call the model function to delete the event
    return res.status(200).json({
      status: "success",
      message: "Evento eliminado con exito.",
    });
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    //If there has been an error, return a 500 error
    return res
      .status(500)
      .json({ message: "Error trying to delete the event" });
  }
};
