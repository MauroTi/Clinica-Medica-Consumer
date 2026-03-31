// ============================================================================
// ROTAS
// ============================================================================

import express from "express";

export function createPacienteRoutes(pacienteController) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      await pacienteController.index(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      await pacienteController.show(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      await pacienteController.store(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      await pacienteController.update(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await pacienteController.destroy(req, res);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export function createMedicoRoutes(medicoController) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      await medicoController.index(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      await medicoController.show(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      await medicoController.store(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      await medicoController.update(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await medicoController.destroy(req, res);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export function createConsultaRoutes(consultaController) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      await consultaController.index(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      await consultaController.show(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      await consultaController.store(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      await consultaController.update(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await consultaController.destroy(req, res);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
