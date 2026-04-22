const PipelineTests =
{
    Test(name, config = {})
    {
        config = this.onetype.DataDefine(config, {
            description: ['string', ''],
            properties:  ['object', {}],
            code:        ['number', 200],
            out:         ['object', {}]
        });

        this.tests[name] = {
            name,
            description: config.description,
            properties:  config.properties,
            code:        config.code,
            out:         config.out
        };

        return this;
    },

    TestGet(name)
    {
        return this.tests[name] || null;
    },

    Tests()
    {
        return this.tests;
    },

    async RunTest(name)
    {
        const test = this.TestGet(name);

        if(!test)
        {
            return this.onetype.Error(404, 'Pipeline :pipeline: test :name: not found.', {pipeline: this.name, name});
        }

        const originalWrap = this.config.wrap;

        if(originalWrap)
        {
            this.config.wrap = async (run) =>
            {
                try
                {
                    await originalWrap(async (connection) =>
                    {
                        await run(connection);
                        throw new Error('__PIPELINE_TEST_ROLLBACK__');
                    });
                }
                catch(error)
                {
                    if(error.message !== '__PIPELINE_TEST_ROLLBACK__')
                    {
                        throw error;
                    }
                }
            };
        }

        let result;

        try
        {
            result = await this.Run({...test.properties});
        }
        finally
        {
            this.config.wrap = originalWrap;
        }

        let passed = result.code === test.code;

        if(passed && Object.keys(test.out).length)
        {
            try
            {
                this.onetype.DataDefine(result.data && typeof result.data === 'object' ? {...result.data} : {}, test.out);
            }
            catch(e)
            {
                passed = false;
            }
        }

        return {...result, passed};
    },

    async RunTests()
    {
        const results = [];

        let passed = 0;
        let failed = 0;

        for(const name of Object.keys(this.tests))
        {
            const result = await this.RunTest(name);

            results.push({name, ...result});

            if(result.passed)
            {
                passed++;
            }
            else
            {
                failed++;
            }
        }

        const total   = results.length;
        const percent = total ? Math.round(passed / total * 100) : 0;

        return {passed, failed, total, percent, results};
    }
};

export default PipelineTests;
