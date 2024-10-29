import os
import pandas as pd
from openai import OpenAI
from dotenv import load_dotenv

import query_data

load_dotenv()


def load_test_dataframe():
    file_path = 'test_dataframe.xlsx'

    # Load the Excel file
    df = pd.read_excel(file_path)

    return df


def summarize_gen_answer(gen_ans):
    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system",
             "content": "Please provide a concise summary of the following generated answer, highlighting the key points in a clear and straightforward manner."},
            {"role": "system", "content": "Generated Answer: " + gen_ans},
        ],
        temperature=0.5,
        top_p=0.5
    )

    sum_ans = response.choices[0].message.content

    return sum_ans


def evaluate_answer(sum_ans, exp_ans):
    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system",
             "content": "Evaluate the following pair of answers to determine if they convey the same meaning:"},
            {"role": "system", "content": "Summarized Generated Answer: " + sum_ans},
            {"role": "system", "content": "Expected Answer: " + exp_ans},
            {"role": "system", "content": "Consider factors such as accuracy and whether key information is preserved. "
                                          "Respond with one of the following: TRUE or FALSE"},
        ],
        temperature=0.5,
        top_p=0.5
    )

    result = response.choices[0].message.content

    if result == "TRUE":
        return "TRUE"
    elif result == "FALSE":
        return "FALSE"


if __name__ == "__main__":
    df = load_test_dataframe()

    true_count = 0
    false_count = 0

    for index, row in df.iterrows():
        query = row[0]
        exp_ans = row[1]
        gen_ans = query_data.query_rag(query)
        sum_ans = summarize_gen_answer(gen_ans)

        eval_result = evaluate_answer(sum_ans, exp_ans)

        if eval_result == "TRUE":
            true_count = true_count + 1
        elif eval_result == "FALSE":
            false_count = false_count + 1

    accuracy = true_count / (true_count + false_count)
    print(true_count)
    print(false_count)
    print(accuracy)
