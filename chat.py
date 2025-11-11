import streamlit as st
import requests

st.set_page_config(page_title="FinAI Chat", layout="wide")

st.title("FinAI Chat - Financial Advisory Chatbot")

if 'messages' not in st.session_state:
    st.session_state.messages = []

if 'user_id' not in st.session_state:
    user_id = st.text_input("Enter User ID:")
    if user_id:
        st.session_state.user_id = int(user_id)
        st.rerun()
else:
    # Display chat history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask FinAI about your finances..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        
        try:
            response = requests.post(f'http://localhost:5000/api/chat/{st.session_state.user_id}', json={
                'message': prompt
            })
            assistant_message = response.json().get('response', 'Unable to generate response')
            
            st.session_state.messages.append({"role": "assistant", "content": assistant_message})
            
            with st.chat_message("assistant"):
                st.markdown(assistant_message)
        except Exception as e:
            st.error(f"Error: {str(e)}")
