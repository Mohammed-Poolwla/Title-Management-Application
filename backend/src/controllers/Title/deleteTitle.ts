import { Response } from "express";
import httpStatus from "http-status";
import { titleService } from "../../services";
import { errorHandlerWrapper } from "../../utils";

const deleteTitleHandler = async (req, res: Response) => {
  const { uuid } = req.params;
  const newTitle = await titleService.deleteTitle(uuid);
  res.json(newTitle).status(httpStatus.ACCEPTED);
};

export const deleteTitleController = errorHandlerWrapper(deleteTitleHandler);
