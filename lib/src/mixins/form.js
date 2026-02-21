const DivhuntForm =
{
    FormGet(element)
    {
        const data = {};
        const inputs = element.querySelectorAll('input[name], textarea[name], select[name]');

        inputs.forEach(input =>
        {
            const name = input.getAttribute('name');

            if(!name)
            {
                return;
            }

            if(input.type === 'checkbox')
            {
                data[name] = input.checked;
            }
            else if(input.type === 'radio')
            {
                if(input.checked)
                {
                    data[name] = input.value;
                }
            }
            else
            {
                data[name] = input.value;
            }
        });

        return data;
    },

    FormSet(element, data)
    {
        if(!data || typeof data !== 'object')
        {
            return;
        }

        Object.entries(data).forEach(([name, value]) =>
        {
            const inputs = element.querySelectorAll(`[name="${name}"]`);

            inputs.forEach(input =>
            {
                if(input.type === 'checkbox')
                {
                    input.checked = !!value;
                }
                else if(input.type === 'radio')
                {
                    input.checked = input.value === value;
                }
                else
                {
                    input.value = value;
                }
            });
        });
    }
};

export default DivhuntForm;
