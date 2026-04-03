const OneTypeDependencies =
{
    Dependency(name, value = null)
    {
        if(value === null)
        {
            return this.DependencyGet(name, false);
        }

        return this.DependencyAdd(name, value);
    },

    Dependencies()
    {
        return this.dependencies.items;
    },

    DependencyGet(name, object = true)
    {
        if(this.DependencyHas(name))
        {
            if(object)
            {
                return this.dependencies.items[name];
            }

            return this.dependencies.items[name].value;
        }

        return null;
    },

    DependencyAdd(name, value, callback = true)
    {
        const dependency = this.dependencies.items[name] = {name, value};

        if(callback)
        {
            this.dependencies.callbacks.add.forEach(callback =>
            {
                try
                {
                    callback(dependency);
                }
                catch(error)
                {
                    this.Error(500, 'Error while performing dependency add callback.', {name});
                }
            });

            this.Emit('@dependency.add', dependency);
        }

        return this;
    },

    DependencyHas(name)
    {
        return name in this.dependencies.items;
    },

    DependencyRemove(name, callback = true)
    {
        const dependency = this.DependencyGet(name);

        if(!dependency)
        {
            return;
        }

        if(callback)
        {
            this.dependencies.callbacks.remove.forEach(callback =>
            {
                try
                {
                    callback(dependency);
                }
                catch(error)
                {
                    this.Error(500, 'Error while performing dependency remove callback.', {name});
                }
            });

            this.Emit('@dependency.remove', dependency);
        }

        delete this.dependencies.items[name];
        return this;
    },

    DependencyOn(type, callback)
    {
        if(!(type in this.dependencies.callbacks))
        {
            this.Error(400, 'Dependency catcher not found.', {type});
            return this;
        }

        this.dependencies.callbacks[type].push(callback);
    }
};

export default OneTypeDependencies;