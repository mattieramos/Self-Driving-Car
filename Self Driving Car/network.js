class NeuralNetwork{

    //number of neurons in each layer
    constructor(neuronCounts){
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs,network){
        let outputs=Level.feedForward(
            givenInputs,network.levels[0]);
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedForward(
                outputs,network.levels[i]);
        }
        return outputs;
    }

    static mutate(network,amount=1){
        network.levels.forEach(level => {
            for(let i=0;i<level.biases.length;i++){
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }
}

class Level{

    //constructing output and input neurons
    constructor(inputCount,outputCount){
        this.inputs=new Array(inputCount);
        this.outputs=new Array(outputCount);
        this.biases=new Array(outputCount);

        //connecting input neurons to output neurons
        this.weights=[];
        for(let i=0;i<inputCount;i++){
            //for each input node, we'll have an output count of connections
            this.weights[i]=new Array(outputCount); 
        }

        // randomizing so that each weight will have a value
        Level.#randomize(this);
    }

    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                //setting weight to random value between -1 and 1
                //for every input/output pair
                level.weights[i][j]=Math.random()*2-1;
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;
        }
    }

    //computing output values using a feed forward algo
    //given some inputs, using the inputs and I'm passing the level as well,
    //I'm going to go through all the level inputs, and I'm first going to
    //just set them to these given inputs, these will be the values that come
    //from the sensor. so we do that using a simple for-loop
    static feedForward(givenInputs,level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];
        }

        //to get the outputs we are going to loop through every output and 
        //we are giong to calculate some kind of sum between the value of 
        //the inputs and the weights
        for(let i=0;i<level.outputs.length;i++){
            let sum=0
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            } 
        }

        return level.outputs;
    }
}