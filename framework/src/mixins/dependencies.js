// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntDependencies =
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
            try
            {
                this.dependencies.callbacks.add.forEach(callback => callback(dependency));
                this.Emit('dependency.add', dependency);
            }
            catch(error)
            {
                this.LogError('Error while performing dependency add callback.', {name}, error);
            }
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
            try
            {
                this.dependencies.callbacks.remove.forEach(callback => callback(dependency));
                this.Emit('dependency.remove', dependency);
            }
            catch(error)
            {
                this.LogError('Error while performing dependency remove callback.', {name}, error);
            }
        }

        delete this.dependencies.items[name];
        return this;
    },

    DependencyOn(type, callback)
    {
        if(!(type in this.dependencies.callbacks))
        {
            this.LogWarn('Field catcher not found.', {type});
            return this;
        }

        this.dependencies.callbacks[type].push(callback);
    }
};

export default DivhuntDependencies;