const Task = require("../models/Task");

exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, assignedTo } = req.body;
        const task = new Task({ title, description, priority, assignedTo });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        let { page, limit, priority, status } = req.query;

        // Convertir en nombre avec une valeur par défaut
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;

        const skip = (page - 1) * limit;

        // Filtre dynamique
        let filter = {};
        if (priority) filter.priority = priority; // Exemple: ?priority=High
        if (status) filter.status = status; // Exemple: ?status=En cours

        // Récupérer les tâches avec filtres + pagination
        const tasks = await Task.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Compter le total après filtrage
        const totalTasks = await Task.countDocuments(filter);

        res.json({
            page,
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks,
            tasks,
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
    }
};



exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: "Erreur lors de la mise à jour" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        res.json({ message: "Tâche supprimée avec succès" });
    } catch (err) {
        res.status(400).json({ error: "Erreur lors de la suppression" });
    }
};